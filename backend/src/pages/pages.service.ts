import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PagesService {
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
    const page = await this.prisma.page.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: { media: true },
        },
      },
    });

    if (!page) {
      throw new NotFoundException(`Page with id "${id}" not found`);
    }

    return page;
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
    // Get the max order for this page
    const maxOrderSection = await this.prisma.section.findFirst({
      where: { pageId },
      orderBy: { order: 'desc' },
    });

    const nextOrder = maxOrderSection ? maxOrderSection.order + 1 : 1;

    return this.prisma.section.create({
      data: {
        pageId,
        type: dto.type,
        label: dto.label || null,
        order: dto.order ?? nextOrder,
        isVisible: dto.isVisible ?? true,
        props: dto.props || {},
      },
      include: { media: true },
    });
  }

  async updateSection(id: string, dto: any) {
    const updateData: any = {};
    
    if (dto.type !== undefined) updateData.type = dto.type;
    if (dto.label !== undefined) updateData.label = dto.label || null;
    if (dto.order !== undefined) updateData.order = dto.order;
    if (dto.isVisible !== undefined) updateData.isVisible = dto.isVisible;
    if (dto.props !== undefined) updateData.props = dto.props;

    return this.prisma.section.update({
      where: { id },
      data: updateData,
      include: { media: true },
    });
  }

  async deleteSection(id: string) {
    return this.prisma.section.delete({
      where: { id },
    });
  }

  async reorderSections(pageId: string, sectionIds: string[]) {
    // Update each section's order based on its position in the array
    const updates = sectionIds.map((sectionId, index) =>
      this.prisma.section.update({
        where: { id: sectionId },
        data: { order: index + 1 },
      })
    );

    await this.prisma.$transaction(updates);

    // Return the updated page with sections
    return this.findById(pageId);
  }
}
