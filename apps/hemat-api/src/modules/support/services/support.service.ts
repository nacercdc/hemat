import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Support, SupportReply, User } from '@database/entities';
import { QueryService } from '@shared/services';
import { SupportCreateRequestDto, SupportReplyCreateRequestDto } from '../dtos';
import { SupportQueryDto } from '../dtos/query-support.dto';
import { SupportStatusEnum } from '@shared/enums';
import { FindAllResponseDto } from '@shared/dtos';
import { SupportVisibilityEnum } from '@shared/enums';

@Injectable()
export class SupportService {
  private readonly logger = new Logger(SupportService.name);

  constructor(
    @InjectRepository(Support)
    private readonly supportRepository: Repository<Support>,
    @InjectRepository(SupportReply)
    private readonly supportReplyRepository: Repository<SupportReply>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(query: SupportQueryDto): Promise<FindAllResponseDto<any>> {
    return new QueryService<Support>(this.supportRepository)
      .join(query.include)
      .filter([], { fields: ['title'], value: query.search })
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip)
      .getManyAndCount();
  }

  async findAllByUser(
    userId: string,
    query: SupportQueryDto,
  ): Promise<FindAllResponseDto<any>> {
    return new QueryService<Support>(this.supportRepository)
      .join(query.include)
      .filter([{ field: 'issuedBy.id', operator: '=', value: userId }], {
        fields: ['title', 'description'],
        value: query.search,
      })
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip)
      .getManyAndCount();
  }

  async findOne(id: string, query: SupportQueryDto): Promise<Support> {
    // Always include only replies
    const baseRelations = ['replies'];
    const relations = Array.isArray(query.include)
      ? Array.from(new Set([...(query.include || []), ...baseRelations]))
      : baseRelations;
    const support = await this.supportRepository.findOne({
      where: { id },
      relations,
    });
    if (!support) throw new NotFoundException(`Support ${id} not found.`);
    return support;
  }

  async create(dto: SupportCreateRequestDto, userId: string): Promise<Support> {
    return this.dataSource.transaction(async (manager) => {
      const userEntity = await manager
        .getRepository(User)
        .findOne({ where: { id: userId } });
      if (!userEntity) throw new NotFoundException('User not found');
      const support = manager.getRepository(Support).create({
        title: dto.title,
        description: dto.description,
        issuedBy: userEntity,
        status: SupportStatusEnum.OPEN,
      });
      try {
        return await manager.getRepository(Support).save(support);
      } catch (err) {
        this.logger.error('create:', err);
        throw new BadRequestException('Failed to create support ticket.');
      }
    });
  }

  async update(id: string, dto: SupportCreateRequestDto): Promise<Support> {
    return this.dataSource.transaction(async (manager) => {
      const support = await manager
        .getRepository(Support)
        .findOne({ where: { id } });
      if (!support) throw new NotFoundException(`Support ${id} not found.`);
      support.title = dto.title;
      support.description = dto.description;
      try {
        return await manager.getRepository(Support).save(support);
      } catch (err) {
        this.logger.error('update:', err);
        throw new BadRequestException('Failed to update support ticket.');
      }
    });
  }

  async delete(id: string): Promise<Support> {
    return this.dataSource.transaction(async (manager) => {
      const support = await manager
        .getRepository(Support)
        .findOne({ where: { id } });
      if (!support) throw new NotFoundException(`Support ${id} not found.`);
      try {
        // Soft delete all replies for this support ticket
        await manager
          .getRepository(SupportReply)
          .softDelete({ support: { id } });
        // Soft delete the support ticket
        return await manager.getRepository(Support).softRemove(support);
      } catch (err) {
        this.logger.error('delete:', err);
        throw new BadRequestException('Failed to delete support ticket.');
      }
    });
  }

  async restore(id: string): Promise<Support> {
    return this.dataSource.transaction(async (manager) => {
      const support = await manager
        .getRepository(Support)
        .findOne({ where: { id }, withDeleted: true });
      if (!support) throw new NotFoundException(`Support ${id} not found.`);
      try {
        return await manager.getRepository(Support).recover(support);
      } catch (err) {
        this.logger.error('restore:', err);
        throw new BadRequestException('Failed to restore support ticket.');
      }
    });
  }

  async replyToSupport(
    supportId: string,
    dto: SupportReplyCreateRequestDto,
    repliedById: string,
  ): Promise<SupportReply> {
    return this.dataSource.transaction(async (manager) => {
      const support = await manager
        .getRepository(Support)
        .findOne({ where: { id: supportId } });
      if (!support) throw new NotFoundException('Support ticket not found');
      const userEntity = await manager
        .getRepository(User)
        .findOne({ where: { id: repliedById } });
      if (!userEntity) throw new NotFoundException('User not found');
      const reply = manager.getRepository(SupportReply).create({
        support,
        repliedBy: userEntity,
        description: dto.description,
        visibility: dto.visibility,
        priority: dto.priority,
        status: dto.status,
      });
      try {
        return await manager.getRepository(SupportReply).save(reply);
      } catch (err) {
        this.logger.error('reply:', err);
        throw new BadRequestException('Failed to create support reply.');
      }
    });
  }

  async findAllReplies(
    query: SupportQueryDto,
  ): Promise<FindAllResponseDto<any>> {
    return new QueryService<SupportReply>(this.supportReplyRepository)
      .join(query.include)
      .filter([], { fields: ['description'], value: query.search })
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip)
      .getManyAndCount();
  }

  async findAllRepliesByUser(
    userId: string,
    query: SupportQueryDto,
  ): Promise<FindAllResponseDto<any>> {
    return new QueryService<SupportReply>(this.supportReplyRepository)
      .join(query.include)
      .filter([{ field: 'support.issuedById', operator: '=', value: userId }], {
        fields: ['description'],
        value: query.search,
      })
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip)
      .getManyAndCount();
  }

  async findOneReply(
    id: string,
    query: SupportQueryDto,
  ): Promise<SupportReply> {
    const reply = await this.supportReplyRepository.findOne({
      where: { id },
      relations: query.include,
    });
    if (!reply) throw new NotFoundException(`Support reply ${id} not found.`);
    return reply;
  }
}
