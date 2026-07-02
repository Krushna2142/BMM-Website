import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import sharp from 'sharp';
import * as mime from 'mime-types';
import { existsSync, mkdirSync, writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

@Injectable()
export class MediaService {
  private readonly uploadDir: string;
  private readonly maxFileSize: number;
  private readonly imageQuality: number;
  private readonly imageMaxWidth: number;
  private readonly imageMaxHeight: number;

  constructor(private prisma: PrismaService) {
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '5242880', 10); // 5MB default
    this.imageQuality = parseInt(process.env.IMAGE_QUALITY || '80', 10);
    this.imageMaxWidth = parseInt(process.env.IMAGE_MAX_WIDTH || '1920', 10);
    this.imageMaxHeight = parseInt(process.env.IMAGE_MAX_HEIGHT || '1080', 10);

    // Ensure upload directory exists
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File, sectionId?: string) {
    // Validate file size
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`
      );
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only image files (JPEG, PNG, GIF, WebP) are allowed');
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = '.jpg'; // We'll convert everything to JPEG
    const filename = `${uniqueSuffix}${ext}`;
    const filepath = join(this.uploadDir, filename);

    // Compress and save image
    let finalSize = file.size;
    let width: number | undefined;
    let height: number | undefined;

    try {
      const metadata = await sharp(file.buffer).metadata();
      width = metadata.width;
      height = metadata.height;

      // Calculate new dimensions while maintaining aspect ratio
      let newWidth = width || this.imageMaxWidth;
      let newHeight = height || this.imageMaxHeight;

      if (newWidth > this.imageMaxWidth || newHeight > this.imageMaxHeight) {
        const ratio = Math.min(
          this.imageMaxWidth / newWidth,
          this.imageMaxHeight / newHeight
        );
        newWidth = Math.floor(newWidth * ratio);
        newHeight = Math.floor(newHeight * ratio);
      }

      // Compress and resize
      const compressedBuffer = await sharp(file.buffer)
        .resize(newWidth, newHeight, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ 
          quality: this.imageQuality, 
          progressive: true,
          mozjpeg: true 
        })
        .toBuffer();

      // ✅ Actually save the file to disk!
      writeFileSync(filepath, compressedBuffer);
      finalSize = compressedBuffer.length;
      width = newWidth;
      height = newHeight;
    } catch (error) {
      console.error('Image processing failed, saving original:', error);
      // Save original file if processing fails
      writeFileSync(filepath, file.buffer);
    }

    // Get MIME type
    const mimeType = mime.lookup(filename) || 'image/jpeg';

    // Save to database
    const media = await this.prisma.media.create({
      data: {
        filename: file.originalname,
        url: `/uploads/${filename}`,
        mimeType: mimeType,
        size: finalSize,
        sectionId: sectionId || null,
      },
    });

    return {
      ...media,
      width,
      height,
    };
  }

  async findAll() {
    return this.prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const media = await this.prisma.media.findUnique({
      where: { id },
      include: {
        section: true,
      },
    });

    if (!media) {
      throw new BadRequestException('Media file not found');
    }

    return media;
  }

  async remove(id: string) {
    const media = await this.findOne(id);

    // ✅ Delete file from disk
    const filepath = join(process.cwd(), media.url);
    if (existsSync(filepath)) {
      try {
        unlinkSync(filepath);
      } catch (error) {
        console.error('Failed to delete file from disk:', error);
      }
    }

    // Delete from database
    return this.prisma.media.delete({
      where: { id },
    });
  }

  async getStats() {
    const totalFiles = await this.prisma.media.count();
    const totalSize = await this.prisma.media.aggregate({
      _sum: { size: true },
    });

    return {
      totalFiles,
      totalSize: totalSize._sum.size || 0,
      averageSize: totalFiles > 0 ? (totalSize._sum.size || 0) / totalFiles : 0,
    };
  }

  async findBySection(sectionId: string) {
    return this.prisma.media.findMany({
      where: { sectionId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
