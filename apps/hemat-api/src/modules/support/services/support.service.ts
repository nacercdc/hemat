import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Support, SupportReply, User } from '@database/entities';
import {
  SupportCreateRequestDto,
  SupportReplyCreateRequestDto,
  SupportResponseDto,
  SupportReplyResponseDto,
} from '../dtos';
import { SupportStatusEnum } from '@shared/enums';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(Support)
    private readonly supportRepository: Repository<Support>,
    @InjectRepository(SupportReply)
    private readonly supportReplyRepository: Repository<SupportReply>,
  ) {}

  async createSupport(dto: SupportCreateRequestDto, issuedBy: User): Promise<SupportResponseDto> {
    const support = this.supportRepository.create({
      title: dto.title,
      description: dto.description,
      issuedBy,
      status: SupportStatusEnum.OPEN,
    });
    const saved = await this.supportRepository.save(support);
    const entity = await this.getSupportEntityWithReplies(saved.id);
    return this.toSupportResponseDto(entity);
  }

  async replyToSupport(
    supportId: string,
    dto: SupportReplyCreateRequestDto,
    repliedBy: User,
  ): Promise<SupportReplyResponseDto> {
    const support = await this.supportRepository.findOne({ where: { id: supportId } });
    if (!support) throw new NotFoundException('Support ticket not found');
    const reply = this.supportReplyRepository.create({
      support,
      repliedBy,
      description: dto.description,
      visibility: dto.visibility,
      priority: dto.priority,
      status: dto.status,
    });
    const saved = await this.supportReplyRepository.save(reply);
    return this.toSupportReplyResponseDto(saved);
  }

  async getAllSupports(): Promise<SupportResponseDto[]> {
    const supports = await this.supportRepository.find({ order: { createdAt: 'DESC' } });
    return Promise.all(supports.map(async (s) => {
      const entity = await this.getSupportEntityWithReplies(s.id);
      return this.toSupportResponseDto(entity);
    }));
  }

  async getSupportById(id: string): Promise<SupportResponseDto> {
    const support = await this.getSupportEntityWithReplies(id);
    if (!support) throw new NotFoundException('Support ticket not found');
    return this.toSupportResponseDto(support);
  }

  async getAllSupportsByUser(userId: string): Promise<SupportResponseDto[]> {
    const supports = await this.supportRepository.find({
      where: { issuedBy: { id: userId } },
      order: { createdAt: 'DESC' },
    });
    return Promise.all(supports.map(async (s) => {
      const entity = await this.getSupportEntityWithReplies(s.id);
      return this.toSupportResponseDto(entity);
    }));
  }

  // --- Helpers ---
  private async getSupportEntityWithReplies(id: string): Promise<Support> {
    const support = await this.supportRepository.findOne({
      where: { id },
      relations: ['issuedBy', 'replies', 'replies.repliedBy'],
      order: { replies: { createdAt: 'ASC' } },
    });
    if (!support) throw new NotFoundException('Support ticket not found');
    return support;
  }

  private toSupportResponseDto(s: Support): SupportResponseDto {
    return {
      id: s.id,
      title: s.title,
      description: s.description,
      issuedBy: s.issuedBy,
      createdAt: s.createdAt,
      status: s.status,
      replies: (s.replies || []).map((r) => this.toSupportReplyResponseDto(r)),
    };
  }

  private toSupportReplyResponseDto(reply: SupportReply): SupportReplyResponseDto {
    return {
      id: reply.id,
      supportId: reply.support?.id,
      repliedBy: reply.repliedBy,
      description: reply.description,
      createdAt: reply.createdAt,
      visibility: reply.visibility,
      priority: reply.priority,
      status: reply.status,
    };
  }
} 