import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    MulterModule.register({
      // Use memoryStorage so file.buffer is available for sharp processing
      // The service handles writing processed files to disk
      storage: memoryStorage(),
      limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB default
        files: 1, // Only allow single file upload per request
      },
      fileFilter: (req, file, callback) => {
        // Security: Validate MIME type strictly
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return callback(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
