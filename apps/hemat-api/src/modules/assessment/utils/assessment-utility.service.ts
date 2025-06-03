import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User, Language, Country } from '../../../database/entities';

@Injectable()
export class AssessmentUtilityService {
  private readonly loggerService = new Logger(AssessmentUtilityService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  /**
   * Validates that a user exists by ID.
   * @param id - The user ID to validate.
   * @returns The found user entity.
   * @throws BadRequestException if the user is not found.
   */
  async validateUser(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id });

      if (!user) {
        throw new BadRequestException(`User ${id} not found.`);
      }

      this.loggerService.debug(`Validated user with ID: ${id}`);
      return user;
    } catch (err) {
      this.loggerService.error(
        `Failed to validate user ${id}: ${err.message}`,
        err.stack,
      );
      throw err instanceof BadRequestException
        ? err
        : new BadRequestException(`Failed to validate user: ${err.message}`);
    }
  }

  /**
   * Validates that a country exists by code.
   * @param code - The country code to validate.
   * @returns The found country entity.
   * @throws BadRequestException if the country is not found.
   */
  async validateCountry(code: string): Promise<Country> {
    try {
      const country = await this.countryRepository.findOne({ where: { code } });

      if (!country) {
        throw new BadRequestException(`Country ${code} not found.`);
      }

      return country;
    } catch (err) {
      throw err instanceof BadRequestException
        ? err
        : new BadRequestException(`Failed to validate country: ${err.message}`);
    }
  }

  /**
   * Validates that all provided language codes exist.
   * @param langs - Array of language codes to validate.
   * @throws BadRequestException if any language is not found.
   */
  async validateLanguages(langs: string[]): Promise<void> {
    try {
      const languages = await this.languageRepository.find({
        where: { code: In(langs) },
        select: { code: true },
      });

      const foundCodes = new Set(languages.map((lang) => lang.code));
      const missingLanguages = langs.filter((lang) => !foundCodes.has(lang));

      if (missingLanguages.length > 0) {
        throw new BadRequestException(
          `Language(s) ${missingLanguages.join(', ')} not found.`,
        );
      }
    } catch (err) {
      throw err instanceof BadRequestException
        ? err
        : new BadRequestException(
            `Failed to validate languages: ${err.message}`,
          );
    }
  }
}
