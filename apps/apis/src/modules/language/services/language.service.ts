import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from '@database/entities';
import { QueryService } from '@shared/services';
import {
  FindAllLanguageDto,
  FindOneLanguageDto,
  LanguageCreateRequestDto,
  LanguageUpdateRequestDto,
} from '../dtos';
import { FindAllResponseDto } from '@shared/dtos';

@Injectable()
export class LanguageService {
  private readonly logger = new Logger(LanguageService.name);

  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  async findAll(
    query: FindAllLanguageDto,
  ): Promise<FindAllResponseDto<Language>> {
    try {
      return await new QueryService<Language>(this.languageRepository)
        .filter([], { fields: ['name', 'native'], value: query.search })
        .sort({ ascending: query.ascending, descending: query.descending })
        .take(query.take)
        .skip(query.skip)
        .getManyAndCount();
    } catch (err) {
      this.logger.error('findAll:', err);
      throw new BadRequestException('Failed to fetch languages.');
    }
  }

  async findOne(_: FindOneLanguageDto, code: string): Promise<Language> {
    const language = await this.languageRepository.findOne({
      where: { code },
    });

    if (!language) {
      throw new NotFoundException(`Language ${code} not found.`);
    }

    return language;
  }

  async create(payload: LanguageCreateRequestDto): Promise<Language> {
    const language = this.languageRepository.create(payload);
    return await this.languageRepository.save(language);
  }

  async update(
    code: string,
    payload: LanguageUpdateRequestDto,
  ): Promise<Language> {
    const language = await this.languageRepository.findOne({
      where: { code },
    });

    if (!language) {
      throw new NotFoundException(`Language ${code} not found.`);
    }

    Object.assign(language, payload);
    return await this.languageRepository.save(language);
  }

  async delete(code: string): Promise<Language> {
    const language = await this.languageRepository.findOne({
      where: { code },
    });

    if (!language) {
      throw new NotFoundException(`Language ${code} not found.`);
    }

    return await this.languageRepository.softRemove(language);
  }

  async restore(code: string): Promise<Language> {
    const language = await this.languageRepository.findOne({
      where: { code },
      withDeleted: true,
    });

    if (!language) {
      throw new NotFoundException(`Language ${code} not found.`);
    }

    return await this.languageRepository.recover(language);
  }
}
