import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { SubComponent, Component, MeasurementScale } from '@database/entities';
import { QueryService } from '@shared/services';
import {
  FindAllSubComponentDto,
  FindOneSubComponentDto,
  SubComponentCreateRequestDto,
  SubComponentUpdateRequestDto,
  SubComponentMeasurementScaleDto,
} from '../dtos';
import { FindAllResponseDto } from '@shared/dtos';

@Injectable()
export class SubComponentService {
  private readonly logger = new Logger(SubComponentService.name);

  constructor(
    @InjectRepository(SubComponent)
    private readonly subComponentRepository: Repository<SubComponent>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    query: FindAllSubComponentDto,
  ): Promise<FindAllResponseDto<SubComponent>> {
    try {
      return await new QueryService<SubComponent>(this.subComponentRepository)
        .join(query.include)
        .filter([], {
          fields: ['code', 'name'],
          value: query.search,
        })
        .sort({ ascending: query.ascending, descending: query.descending })
        .take(query.take)
        .skip(query.skip)
        .getManyAndCount();
    } catch (err) {
      this.logger.error('findAll:', err);
      throw new BadRequestException('Failed to fetch sub-components.');
    }
  }

  async findOne(
    id: string,
    query: FindOneSubComponentDto,
  ): Promise<SubComponent> {
    const subComponent = await this.subComponentRepository.findOne({
      where: { id },
      relations: query.include,
    });

    if (!subComponent) {
      throw new NotFoundException(`Sub-component ${id} not found.`);
    }

    return subComponent;
  }

  async create(payload: SubComponentCreateRequestDto): Promise<SubComponent> {
    return this.dataSource.transaction(async (manager) => {
      const component = await manager.getRepository(Component).findOne({
        where: { id: payload.componentId },
      });

      if (!component) {
        throw new NotFoundException(
          `Component ${payload.componentId} not found.`,
        );
      }

      const subComponent = manager.getRepository(SubComponent).create({
        ...payload,
        component,
      });

      return await manager.getRepository(SubComponent).save(subComponent);
    });
  }

  async update(
    id: string,
    payload: SubComponentUpdateRequestDto,
  ): Promise<SubComponent> {
    return this.dataSource.transaction(async (manager) => {
      const subComponent = await manager.getRepository(SubComponent).findOne({
        where: { id },
        relations: ['component', 'measurementScales'],
      });

      if (!subComponent) {
        throw new NotFoundException(`Sub-component ${id} not found.`);
      }

      let component = subComponent.component;
      if (
        payload.componentId &&
        payload.componentId !== subComponent.component.id
      ) {
        const newComponent = await manager.getRepository(Component).findOne({
          where: { id: payload.componentId },
        });
        if (!newComponent) {
          throw new NotFoundException(
            `Component ${payload.componentId} not found.`,
          );
        }
        component = newComponent;
      }

      Object.assign(subComponent, { ...payload, component });
      return await manager.getRepository(SubComponent).save(subComponent);
    });
  }

  async delete(id: string): Promise<SubComponent> {
    const subComponent = await this.subComponentRepository.findOne({
      where: { id },
      relations: ['measurementScales'],
    });

    if (!subComponent) {
      throw new NotFoundException(`Sub-component ${id} not found.`);
    }

    return await this.subComponentRepository.softRemove(subComponent);
  }

  async restore(id: string): Promise<SubComponent> {
    const subComponent = await this.subComponentRepository.findOne({
      where: { id },
      withDeleted: true,
      relations: ['measurementScales'],
    });

    if (!subComponent) {
      throw new NotFoundException(`Sub-component ${id} not found.`);
    }

    return await this.subComponentRepository.recover(subComponent);
  }
}