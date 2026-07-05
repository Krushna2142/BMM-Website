import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { createClient } from '@supabase/supabase-js';

const sharp = require('sharp');

@Injectable()
export class MediaService {
  private readonly supabase;
  private readonly bucketName = 'bmm-media';
  private readonly maxFileSize = 10485760; // 10MB

  constructor(private prisma: PrismaService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    );
  }

  async uploadFile(file: Express.Multer.File, folder?: string) {
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`File size exceeds ${this.maxFileSize / 1024 / 1024}MB`);
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only image files allowed');
    }

    // Validate folder name
    let safeFolder = '';
    if (folder) {
      if (!/^[a-zA-Z0-9\-_]+$/.test(folder)) {
        throw new BadRequestException('Invalid folder name');
      }
      safeFolder = folder;
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${uniqueSuffix}.jpg`;
    const storagePath = safeFolder ? `${safeFolder}/${filename}` : filename;

    // Process with Sharp
    let finalBuffer: Buffer = file.buffer;
    let finalSize = file.size;
    let width: number | undefined;
    let height: number | undefined;

    try {
      const metadata = await sharp(file.buffer).metadata();
      width = metadata.width;
      height = metadata.height;

      let newWidth = width || 1920;
      let newHeight = height || 1080;

      if (newWidth > 1920 || newHeight > 1080) {
        const ratio = Math.min(1920 / newWidth, 1080 / newHeight);
        newWidth = Math.floor(newWidth * ratio);
        newHeight = Math.floor(newHeight * ratio);
      }

      finalBuffer = await sharp(file.buffer)
        .resize(newWidth, newHeight, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80, progressive: true, mozjpeg: true })
        .toBuffer();

      finalSize = finalBuffer.length;
      width = newWidth;
      height = newHeight;
    } catch (error) {
      console.error('Sharp failed:', error);
    }

    // Upload to Supabase
    const { error: uploadError } = await this.supabase.storage
      .from(this.bucketName)
      .upload(storagePath, finalBuffer, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new BadRequestException(`Upload failed: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(storagePath);

    // Save to database
    const media = await this.prisma.media.create({
      data: {
        filename: file.originalname,
        originalName: file.originalname,
        url: publicUrl,
        mimeType: 'image/jpeg',
        size: finalSize,
        width: width || null,
        height: height || null,
        folder: safeFolder || undefined,
      },
    });

    return media;
  }

  async getFolders() {
    const mediaItems = await this.prisma.media.findMany({
      select: { folder: true },
      distinct: ['folder'],
    });
    return mediaItems.map(m => m.folder).filter(Boolean);
  }

  async findAll(folder?: string) {
    const where = folder ? { folder: folder } : {};
    return this.prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new BadRequestException('Not found');
    return media;
  }

  async remove(id: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });
    if (!media) throw new BadRequestException('Not found');

    const urlParts = media.url.split('/');
    const filename = urlParts[urlParts.length - 1];
    const folder = media.folder || '';
    const storagePath = folder ? `${folder}/${filename}` : filename;

    await this.supabase.storage.from(this.bucketName).remove([storagePath]);
    return this.prisma.media.delete({ where: { id } });
  }

  async renameFile(id: string, newName: string) {
    if (newName.includes('..') || newName.includes('/') || newName.includes('\\')) {
      throw new BadRequestException('Invalid name');
    }
    return this.prisma.media.update({
      where: { id },
      data: { originalName: newName },
    });
  }

  async moveFiles(ids: string[], targetFolder: string) {
    if (targetFolder && !/^[a-zA-Z0-9\-_]+$/.test(targetFolder)) {
      throw new BadRequestException('Invalid folder');
    }
    return this.prisma.media.updateMany({
      where: { id: { in: ids } },
      data: { folder: targetFolder || undefined },
    });
  }

  async copyFiles(ids: string[], targetFolder: string) {
    if (targetFolder && !/^[a-zA-Z0-9\-_]+$/.test(targetFolder)) {
      throw new BadRequestException('Invalid folder');
    }
    const files = await this.prisma.media.findMany({ where: { id: { in: ids } } });
    const createData = files.map(f => ({
      filename: f.filename,
      originalName: f.originalName,
      url: f.url,
      mimeType: f.mimeType,
      size: f.size,
      width: f.width,
      height: f.height,
      folder: targetFolder || undefined,
    }));
    return this.prisma.media.createMany({ data: createData });
  }

  async getStats() {
    const totalFiles = await this.prisma.media.count();
    const totalSize = await this.prisma.media.aggregate({ _sum: { size: true } });
    return {
      totalFiles,
      totalSize: totalSize._sum.size || 0,
      averageSize: totalFiles > 0 ? (totalSize._sum.size || 0) / totalFiles : 0,
    };
  }
}