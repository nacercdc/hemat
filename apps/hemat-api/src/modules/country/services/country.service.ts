import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '@database/entities';
import { QueryService } from '@shared/services';
import { FindAllCountryDto } from '../dtos';
import { FindAllResponseDto } from '@shared/dtos';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async findAll(
    query: FindAllCountryDto,
  ): Promise<FindAllResponseDto<Country>> {
    return new QueryService<Country>(this.countryRepository)
      .filter([], { fields: ['code', 'name', 'native'], value: query.search })
      .sort({ ascending: query.ascending, descending: query.descending })
      .take(query.take)
      .skip(query.skip)
      .getManyAndCount();
  }

  async findOne(code: string): Promise<Country> {
    const country = await this.countryRepository.findOne({
      where: { code },
    });

    if (!country) {
      throw new NotFoundException(`Country ${code} not found.`);
    }

    return country;
  }
}
