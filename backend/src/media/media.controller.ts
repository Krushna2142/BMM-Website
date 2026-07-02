import {Controller,Get, Post, Delete, Param,UseInterceptors,UploadedFile,Body,UseGuards,} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('sectionId') sectionId?: string,
  ) {
    return this.mediaService.uploadFile(file, sectionId);
  }

  @Get()
  async findAll() {
    return this.mediaService.findAll();
  }

  @Get('stats')
  async getStats() {
    return this.mediaService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.mediaService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }
}