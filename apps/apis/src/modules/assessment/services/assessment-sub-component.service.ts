import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssessmentSubComponent } from '@africa-cdc/database/entities';
import { AssessmentSubComponentDto } from '../dtos';

@Injectable()
export class AssessmentSubComponentService {
  private readonly logger = new Logger(AssessmentSubComponentService.name);

  constructor(
    @InjectRepository(AssessmentSubComponent)
    private readonly assessmentSubComponentRepository: Repository<AssessmentSubComponent>,
  ) {}

  async findAll(assessmentId: string): Promise<AssessmentSubComponent[]> {
    return this.assessmentSubComponentRepository.find({
      where: { assessmentId },
    });
  }

  async findOne(
    assessmentId: string,
    id: string,
  ): Promise<AssessmentSubComponent> {
    const subComponent = await this.assessmentSubComponentRepository.findOne({
      where: { id, assessmentId },
    });
    if (!subComponent) {
      throw new NotFoundException('Assessment sub-component not found');
    }
    return subComponent;
  }

  async update(
    assessmentId: string,
    id: string,
    payload: AssessmentSubComponentDto,
  ): Promise<AssessmentSubComponent> {
    const subComponent = await this.findOne(assessmentId, id);
    try {
      const entity = {
        code: payload.code,
        name: payload.name,
        description: payload.description,
        translations: payload.translations,
      };
      await this.assessmentSubComponentRepository.update(
        { id, assessmentId },
        entity,
      );

      return { ...subComponent, ...entity };
    } catch (err) {
      this.logger.error(
        `Failed to update assessment sub-component: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException(
        'Failed to update assessment sub-component',
      );
    }
  }
}
