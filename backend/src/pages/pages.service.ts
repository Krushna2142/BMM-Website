import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSectionDto, UpdateSectionDto } from './dto/section.dto';
import { CreatePageDto, UpdatePageDto } from './dto/page.dto';
import { PageStatus } from '../generated/prisma/client';

@Injectable()
export class PagesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.page.findMany({
      where: { deletedAt: null },
      include: {
        sections: {
          where: { deletedAt: null },
          orderBy: { order: 'asc' },
          include: { media: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const page = await this.prisma.page.findFirst({
      where: { slug, deletedAt: null },
      include: {
        sections: {
          where: { isVisible: true, deletedAt: null },
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
    const page = await this.prisma.page.findFirst({
      where: { id, deletedAt: null },
      include: {
        sections: {
          where: { deletedAt: null },
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

  async create(data: CreatePageDto) {
    return this.prisma.page.create({
      data: {
        slug: data.slug,
        title: data.title,
        description: data.description,
        status: data.status || PageStatus.DRAFT,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords || [],
        publishedAt: data.status === PageStatus.PUBLISHED ? new Date() : null,
      },
    });
  }

  async update(id: string, data: UpdatePageDto) {
    // Verify page exists and is not deleted
    await this.findById(id);

    const updateData: any = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.seoTitle !== undefined) updateData.seoTitle = data.seoTitle;
    if (data.seoDescription !== undefined) updateData.seoDescription = data.seoDescription;
    if (data.seoKeywords !== undefined) updateData.seoKeywords = data.seoKeywords;

    if (data.status !== undefined) {
      updateData.status = data.status;
      if (data.status === PageStatus.PUBLISHED) {
        updateData.publishedAt = new Date();
      }
    }

    return this.prisma.page.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string) {
    // Verify page exists
    await this.findById(id);

    // Soft delete
    return this.prisma.page.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async createSection(pageId: string, dto: CreateSectionDto) {
    // Verify page exists
    await this.findById(pageId);

    // Get the max order for this page if order not provided
    let nextOrder = dto.order;
    if (nextOrder === undefined || nextOrder === null) {
      const maxOrderSection = await this.prisma.section.findFirst({
        where: { pageId, deletedAt: null },
        orderBy: { order: 'desc' },
      });
      nextOrder = maxOrderSection ? maxOrderSection.order + 1 : 1;
    }

    return this.prisma.section.create({
      data: {
        pageId,
        type: dto.type,
        label: dto.label || null,
        order: nextOrder,
        isVisible: dto.isVisible ?? true,
        props: dto.props || {},
        mobileProps: dto.mobileProps,
        customStyles: dto.customStyles,
        publishStartAt: dto.publishStartAt ? new Date(dto.publishStartAt) : null,
        publishEndAt: dto.publishEndAt ? new Date(dto.publishEndAt) : null,
      },
      include: { media: true },
    });
  }

  async updateSection(id: string, dto: UpdateSectionDto) {
    const updateData: any = {};

    if (dto.type !== undefined) updateData.type = dto.type;
    if (dto.label !== undefined) updateData.label = dto.label || null;
    if (dto.order !== undefined) updateData.order = dto.order;
    if (dto.isVisible !== undefined) updateData.isVisible = dto.isVisible;
    if (dto.props !== undefined) updateData.props = dto.props;
    if (dto.mobileProps !== undefined) updateData.mobileProps = dto.mobileProps;
    if (dto.customStyles !== undefined) updateData.customStyles = dto.customStyles;
    if (dto.publishStartAt !== undefined) {
      updateData.publishStartAt = dto.publishStartAt ? new Date(dto.publishStartAt) : null;
    }
    if (dto.publishEndAt !== undefined) {
      updateData.publishEndAt = dto.publishEndAt ? new Date(dto.publishEndAt) : null;
    }

    return this.prisma.section.update({
      where: { id },
      data: updateData,
      include: { media: true },
    });
  }

  async deleteSection(id: string) {
    // Soft delete
    return this.prisma.section.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async reorderSections(pageId: string, sectionIds: string[]) {
    // Verify page exists
    await this.findById(pageId);

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
