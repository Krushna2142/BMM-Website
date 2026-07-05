import { Controller, Get, Post, Delete, Param, Query, Body, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
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
    @Body('folder') folder?: string,
  ) {
    return this.mediaService.uploadFile(file, folder);
  }

  @Get()
  async findAll(@Query('folder') folder?: string) {
    return this.mediaService.findAll(folder);
  }

  @Get('folders')
  async getFolders() {
    return this.mediaService.getFolders();
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

  @Post('rename')
  async rename(@Body() body: { id: string; newName: string }) {
    return this.mediaService.renameFile(body.id, body.newName);
  }

  @Post('move')
  async move(@Body() body: { ids: string[]; targetFolder: string }) {
    return this.mediaService.moveFiles(body.ids, body.targetFolder);
  }

  @Post('copy')
  async copy(@Body() body: { ids: string[]; targetFolder: string }) {
    return this.mediaService.copyFiles(body.ids, body.targetFolder);
  }
}