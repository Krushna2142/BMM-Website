import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PagesService {
  [x: string]: any;
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.page.findMany({
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: { media: true },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    const page = await this.prisma.page.findUnique({
      where: { slug },
      include: {
        sections: {
          where: { isVisible: true },
          orderBy: { order: 'asc' },
          include: { media: true },
        },
      },
    });

    if (!page) {
      throw new NotFoundException(`Page with slug "${slug}" not found`);
    }

    return page;
  }

  async findById(id: string) {
    return this.prisma.page.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: { media: true },
        },
      },
    });
  }

  async create(data: { slug: string; title: string; status?: string }) {
    return this.prisma.page.create({
      data: {
        slug: data.slug,
        title: data.title,
        status: data.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT',
      },
    });
  }

  async update(id: string, data: { title?: string; status?: string }) {
    const updateData: any = {};
    
    if (data.title) {
      updateData.title = data.title;
    }
    
    if (data.status) {
      updateData.status = data.status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT';
    }

    return this.prisma.page.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    return this.prisma.page.delete({
      where: { id },
    });
  }

  async createSection(pageId: string, dto: any) {
    return this.prisma.section.create({
      data: {
        pageId,
        type: dto.type,
        order: dto.order,
        isVisible: dto.isVisible ?? true,
        props: dto.props,
      },
      include: { media: true },
    });
  }

  async updateSection(id: string, dto: any) {
    return this.prisma.section.update({
      where: { id },
      data: dto,
      include: { media: true },
    });
  }

  async deleteSection(id: string) {
    return this.prisma.section.delete({
      where: { id },
    });
  }
}