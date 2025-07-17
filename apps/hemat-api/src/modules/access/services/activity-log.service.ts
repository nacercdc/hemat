import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog } from '../../../database/entities/activity-log.entity';
import { PermissionSubjectEnum, PermissionActionEnum } from '../../../shared/enums/permission.enum';

@Injectable()
export class ActivityLogService {
  constructor(
    @InjectRepository(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
  ) {}

  async findAll({ userId, entity, dateFrom, dateTo }: { userId?: string; entity?: PermissionSubjectEnum; dateFrom?: Date; dateTo?: Date }) {
    const qb = this.activityLogRepository.createQueryBuilder('log');
    if (userId) qb.andWhere('log.userId = :userId', { userId });
    if (entity) qb.andWhere('log.entity = :entity', { entity });
    if (dateFrom) qb.andWhere('log.createdAt >= :dateFrom', { dateFrom });
    if (dateTo) qb.andWhere('log.createdAt <= :dateTo', { dateTo });
    qb.orderBy('log.createdAt', 'DESC');
    return qb.getMany();
  }
} 