import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import sharp from 'sharp'; // 👈 Use default import, not namespace import
import * as mime from 'mime-types';
import { existsSync, mkdirSync } from 'fs';


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

    // Compress image if needed
    let finalBuffer = file.buffer;
    let finalSize = file.size;

    if (file.mimetype.startsWith('image/')) {
      try {
        finalBuffer = await this.compressImage(file.buffer);
        finalSize = finalBuffer.length;
      } catch (error) {
        console.error('Image compression failed, using original:', error);
        // Continue with original file if compression fails
      }
    }

    // Get MIME type
    const mimeType = mime.lookup(file.originalname) || file.mimetype;

    // Save to database
    const media = await this.prisma.media.create({
      data: {
        filename: file.originalname,
        url: `/uploads/${file.filename}`,
        mimeType: mimeType,
        size: finalSize,
        sectionId: sectionId || null,
      },
    });

    return media;
  }

  private async compressImage(buffer: Buffer): Promise<Buffer> {
    try {
      const metadata = await sharp(buffer).metadata();
      
      // Calculate new dimensions while maintaining aspect ratio
      let width = metadata.width || this.imageMaxWidth;
      let height = metadata.height || this.imageMaxHeight;

      if (width > this.imageMaxWidth || height > this.imageMaxHeight) {
        const ratio = Math.min(
          this.imageMaxWidth / width,
          this.imageMaxHeight / height
        );
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      // Compress and resize
      return await sharp(buffer)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ 
          quality: this.imageQuality, 
          progressive: true,
          mozjpeg: true 
        })
        .toBuffer();
    } catch (error) {
      console.error('Image compression error:', error);
      return buffer; // Return original if compression fails
    }
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
    // First check if media exists
    await this.findOne(id);

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