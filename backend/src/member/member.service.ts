import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MemberService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.member.create({ data });
  }

  async findAll(filters: { category?: string; isActive?: boolean; search?: string }) {
    const where: any = {};

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { city: { contains: filters.search, mode: 'insensitive' } },
        { state: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.member.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async findOne(id: string) {
    const member = await this.prisma.member.findUnique({ where: { id } });
    if (!member) throw new NotFoundException('Member not found');
    return member;
  }

  async update(id: string, data: any) {
    await this.findOne(id); // Verify exists
    return this.prisma.member.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id); // Verify exists
    return this.prisma.member.delete({ where: { id } });
  }

  async bulkCreate(members: any[]) {
    return this.prisma.member.createMany({ data: members });
  }

  async reorder(ids: string[]) {
    const updates = ids.map((id, index) =>
      this.prisma.member.update({
        where: { id },
        data: { sortOrder: index },
      }),
    );
    return Promise.all(updates);
  }
}