import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '@database/entities';
import { QueryService } from '@shared/services';
import {
  FindAllPermissionDto,
  FindOnePermissionDto,
} from '../dtos/query-permission.dto';
import { FindAllResponseDto } from '@shared/dtos';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async findAll(
    query: FindAllPermissionDto,
  ): Promise<FindAllResponseDto<Permission>> {
    try {
      return await new QueryService<Permission>(this.permissionRepository)
        .join(query.include)
        .filter([], { fields: ['action', 'subject'], value: query.search })
        .sort({ ascending: query.ascending, descending: query.descending })
        .take(query.take)
        .skip(query.skip)
        .getManyAndCount();
    } catch (err) {
      this.logger.error('findAll:', err);
      throw new NotFoundException('Failed to fetch permissions.');
    }
  }

  async findOne(id: string, query: FindOnePermissionDto): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({
      where: { id },
      relations: query.include,
    });

    if (!permission) {
      throw new NotFoundException(`Permission ${id} not found.`);
    }

    return permission;
  }
}
