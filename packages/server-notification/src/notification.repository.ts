import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, In, Between } from 'typeorm';
import { NotificationEntity } from './entities/notification.entity';
import {
  Channel,
  NotificationStatus,
} from './interface/notification.interface';

export interface CreateNotificationParams {
  userId: string;
  channel: Channel;
  payloadSnapshot?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface ListNotificationsFilter {
  userId?: string;
  channel?: Channel | Channel[];
  status?: NotificationStatus | NotificationStatus[];
  vendorUsed?: string | string[];
  from?: Date;
  to?: Date;
  search?: string;
}

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly repo: Repository<NotificationEntity>,
  ) {}

  async createPending(
    params: CreateNotificationParams,
  ): Promise<NotificationEntity> {
    const entity = this.repo.create({
      userId: params.userId,
      channel: params.channel,
      payloadSnapshot: params.payloadSnapshot,
      metadata: params.metadata,
      status: NotificationStatus.PENDING,
      attempts: 0,
    });
    return this.repo.save(entity);
  }

  async markSent(id: string, data: { vendorUsed: string; attempts?: number }) {
    await this.repo
      .createQueryBuilder()
      .update(NotificationEntity)
      .set({
        status: NotificationStatus.SENT,
        vendorUsed: data.vendorUsed,
        lastError: undefined,
      })
      .set({ attempts: () => 'attempts + 1' })
      .where('id = :id', { id })
      .execute();
  }

  async markFailed(
    id: string,
    data: { vendorUsed?: string; error: string; attempts?: number },
  ) {
    await this.repo
      .createQueryBuilder()
      .update(NotificationEntity)
      .set({
        status: NotificationStatus.FAILED,
        vendorUsed: data.vendorUsed,
        lastError: data.error,
      })
      .set({ attempts: () => 'attempts + 1' })
      .where('id = :id', { id })
      .execute();
  }

  async recordAttempt(
    id: string,
    data: { vendorUsed?: string; error?: string },
  ) {
    await this.repo.update(
      { id },
      {
        attempts: () => 'attempts + 1',
        vendorUsed: data.vendorUsed,
        lastError: data.error,
      },
    );
  }

  async update(id: string, patch: Partial<NotificationEntity>) {
    await this.repo.update({ id }, patch);
    return this.findById(id);
  }

  async findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async list(
    filter: ListNotificationsFilter = {},
    opts: { skip?: number; take?: number; order?: 'ASC' | 'DESC' } = {},
  ) {
    const where: FindOptionsWhere<NotificationEntity> = {};
    if (filter.userId) where.userId = filter.userId;
    if (filter.channel)
      where.channel = Array.isArray(filter.channel)
        ? In(filter.channel)
        : filter.channel;
    if (filter.status)
      where.status = Array.isArray(filter.status)
        ? In(filter.status)
        : filter.status;
    if (filter.vendorUsed)
      where.vendorUsed = Array.isArray(filter.vendorUsed)
        ? In(filter.vendorUsed)
        : filter.vendorUsed;
    if (filter.from || filter.to)
      where.createdAt = Between(
        filter.from ?? new Date(0),
        filter.to ?? new Date(),
      );

    const qb = this.repo.createQueryBuilder('n').where(where);

    if (filter.search) {
      qb.andWhere(
        '(LOWER(CAST(n.payloadSnapshot as text)) LIKE :q OR LOWER(CAST(n.metadata as text)) LIKE :q)',
        { q: `%${filter.search.toLowerCase()}%` },
      );
    }

    qb.orderBy('n.createdAt', opts.order ?? 'DESC')
      .skip(opts.skip ?? 0)
      .take(Math.min(opts.take ?? 50, 200));

    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }

  async statsByStatus(channel?: Channel) {
    const qb = this.repo
      .createQueryBuilder('n')
      .select('n.status', 'status')
      .addSelect('COUNT(1)', 'count')
      .groupBy('n.status');

    if (channel) qb.where('n.channel = :channel', { channel });

    const rows = await qb.getRawMany<{
      status: NotificationStatus;
      count: string;
    }>();
    return rows.map((r) => ({ status: r.status, count: Number(r.count) }));
  }

  async statsByVendor(channel?: Channel) {
    const qb = this.repo
      .createQueryBuilder('n')
      .select("COALESCE(n.vendorUsed, 'unknown')", 'vendor')
      .addSelect('COUNT(1)', 'count')
      .groupBy('vendor');

    if (channel) qb.where('n.channel = :channel', { channel });

    const rows = await qb.getRawMany<{ vendor: string; count: string }>();
    return rows.map((r) => ({ vendor: r.vendor, count: Number(r.count) }));
  }
}
