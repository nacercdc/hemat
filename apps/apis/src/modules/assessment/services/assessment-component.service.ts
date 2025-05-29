import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssessmentComponent } from '@africa-cdc/database/entities';
import { AssessmentComponentDto } from '../dtos';

@Injectable()
export class AssessmentComponentService {
  private readonly logger = new Logger(AssessmentComponentService.name);

  constructor(
    @InjectRepository(AssessmentComponent)
    private readonly assessmentComponentRepository: Repository<AssessmentComponent>,
  ) {}

  async findAll(assessmentId: string): Promise<AssessmentComponent[]> {
    return this.assessmentComponentRepository.find({
      where: { assessmentId },
    });
  }

  async findOne(
    assessmentId: string,
    id: string,
  ): Promise<AssessmentComponent> {
    const component = await this.assessmentComponentRepository.findOne({
      where: { id, assessmentId },
    });
    if (!component) {
      throw new NotFoundException('Assessment component not found');
    }
    return component;
  }

  async update(
    assessmentId: string,
    id: string,
    payload: AssessmentComponentDto,
  ): Promise<AssessmentComponent> {
    const component = await this.findOne(assessmentId, id);
    try {
      const entity = {
        code: payload.code,
        name: payload.name,
        description: payload.description,
        translations: payload.translations,
      };
      await this.assessmentComponentRepository.update(
        { id, assessmentId },
        entity,
      );

      return { ...component, ...entity };
    } catch (err) {
      this.logger.error(
        `Failed to update assessment component: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException('Failed to update assessment component');
    }
  }
}
