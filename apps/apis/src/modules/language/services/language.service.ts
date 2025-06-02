import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { CrudService } from '../../../shared/services';
import { Language } from '../../../database/entities';
import { LanguageCreateRequestDto, LanguageUpdateRequestDto } from '../dtos';
import { LANGUAGE_FIELD_CONFIG } from '../config/language-field-config';
import { QueryOneRequest } from '../../../shared/types';

@Injectable()
export class LanguageService extends CrudService<Language> {
  private readonly loggerService = new Logger(LanguageService.name);

  protected includes = LANGUAGE_FIELD_CONFIG.includeRelations;
  protected selectable = LANGUAGE_FIELD_CONFIG.selectableFields;
  protected searchable = LANGUAGE_FIELD_CONFIG.searchableFields;
  protected filterable = LANGUAGE_FIELD_CONFIG.filterableFields;
  protected sortable = LANGUAGE_FIELD_CONFIG.sortableFields;

  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {
    super(languageRepository);
  }

  /**
   * Finds a language by its code
   * @param code - The language code to search for
   * @param options - Optional query parameters
   * @returns The found language entity
   * @throws {NotFoundException} When language is not found
   * @throws {BadRequestException} When query fails
   */
  public async findOne(
    code: string,
    options?: { query?: QueryOneRequest },
  ): Promise<Language> {
    try {
      const { query = {} } = options ?? {};
      const entity = await this.languageRepository.findOne({
        where: { code },
        select: query.select
          ? this.buildSelectObject(query.select.split(','))
          : this.buildSelectObject(LANGUAGE_FIELD_CONFIG.baseFields),
        withDeleted: query.withDeleted,
      });

      if (!entity) {
        throw new NotFoundException('language.exception.languageNotFound');
      }

      return entity;
    } catch (error) {
      this.loggerService.error('Failed to find language', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        'language.exception.failedToRetrieveLanguage',
      );
    }
  }
  /**
   * Updates a language entity
   * @param where - The conditions to find the language
   * @param payload - The update payload
   * @returns The updated language entity
   * @throws {BadRequestException} When update fails
   */
  public async update(
    where: FindOptionsWhere<Language>,
    payload: LanguageUpdateRequestDto,
  ): Promise<Language> {
    try {
      const language = await this.findOrFail({ where });
      await this.languageRepository.update({ code: language.code }, payload);
      return { ...language, ...payload };
    } catch (error) {
      this.loggerService.error('Failed to update language', error);
      throw new BadRequestException(
        'language.exception.failedToUpdateLanguage',
      );
    }
  }
  /**
   * Soft deletes a language entity
   * @param where - The conditions to find the language
   * @returns The deleted language entity
   * @throws {BadRequestException} When deletion fails
   */
  public async delete(where: FindOptionsWhere<Language>): Promise<Language> {
    try {
      const language = await this.findOrFail({ where });
      await this.languageRepository.softRemove(language);
      return language;
    } catch (error) {
      this.loggerService.error('Failed to delete language', error);
      throw new BadRequestException(
        'language.exception.failedToDeleteLanguage',
      );
    }
  }
  private buildSelectObject(fields: string[]): Record<keyof Language, boolean> {
    return fields.reduce(
      (acc, field) => {
        if (this.selectable.includes(field)) {
          acc[field as keyof Language] = true;
        }
        return acc;
      },
      {} as Record<keyof Language, boolean>,
    );
  }
}
