import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PagesService } from './pages.service';
import { CreateSectionDto, UpdateSectionDto } from './dto/section.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  // Public endpoint - get all pages
  @Get()
  async findAll() {
    return this.pagesService.findAll();
  }

  // Public endpoint - get page by slug
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.pagesService.findBySlug(slug);
  }

  // Admin endpoints below

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.pagesService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body: { slug: string; title: string; status?: string }) {
    return this.pagesService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: { title?: string; status?: string }) {
    return this.pagesService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.pagesService.delete(id);
  }

  // Section endpoints

  @UseGuards(JwtAuthGuard)
  @Post(':pageId/sections')
  async createSection(
    @Param('pageId') pageId: string,
    @Body() dto: CreateSectionDto,
  ) {
    return this.pagesService.createSection(pageId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('sections/:id')
  async updateSection(
    @Param('id') id: string,
    @Body() dto: UpdateSectionDto,
  ) {
    return this.pagesService.updateSection(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('sections/:id')
  async deleteSection(@Param('id') id: string) {
    return this.pagesService.deleteSection(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':pageId/sections/reorder')
  @HttpCode(HttpStatus.OK)
  async reorderSections(
    @Param('pageId') pageId: string,
    @Body() body: { sectionIds: string[] },
  ) {
    return this.pagesService.reorderSections(pageId, body.sectionIds);
  }
}