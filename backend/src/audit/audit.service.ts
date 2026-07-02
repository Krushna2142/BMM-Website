import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditAction } from '../generated/prisma/client';

interface AuditLogInput {
  userId?: string;
  userEmail?: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  entityLabel?: string;
  oldValues?: any;
  newValues?: any;
  changeSummary?: string;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(input: AuditLogInput) {
    try {
      return await this.prisma.auditLog.create({
        data: {
          userId: input.userId,
          userEmail: input.userEmail,
          action: input.action,
          entityType: input.entityType,
          entityId: input.entityId,
          entityLabel: input.entityLabel,
          oldValues: input.oldValues,
          newValues: input.newValues,
          changeSummary: input.changeSummary,
          ipAddress: input.ipAddress,
          userAgent: input.userAgent,
        },
      });
    } catch (error) {
      // Don't throw - audit logging should never break the main operation
      console.error('Failed to create audit log:', error);
    }
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    entityType?: string;
    entityId?: string;
    userId?: string;
    action?: AuditAction;
  }) {
    const { page = 1, limit = 50, entityType, entityId, userId, action } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;
    if (userId) where.userId = userId;
    if (action) where.action = action;

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByEntity(entityType: string, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: { entityType, entityId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });
  }
}
