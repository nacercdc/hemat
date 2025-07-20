import { Controller, Get, Query } from '@nestjs/common';
import { ActivityLogService } from '../services/activity-log.service';
import { PermissionSubjectEnum } from '../../../shared/enums/permission.enum';

@Controller('activity-logs')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get()
  async getLogs(
    @Query('userId') userId?: string,
    @Query('entity') entity?: PermissionSubjectEnum,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.activityLogService.findAll({
      userId,
      entity,
      dateFrom: dateFrom ? new Date(dateFrom) : undefined,
      dateTo: dateTo ? new Date(dateTo) : undefined,
    });
  }
} 