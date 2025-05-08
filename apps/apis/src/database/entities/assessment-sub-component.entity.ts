import { Entity, PrimaryColumn, ManyToOne, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Assessment } from './assessment.entity';
import { SubComponent } from './sub-component.entity';

@Entity('assessment_sub_components')
export class AssessmentSubComponent extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'ID of the associated assessment',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @PrimaryColumn()
  @Index()
  assessmentId: string;

  @ApiProperty({
    description: 'Associated assessment',
    type: () => Assessment,
  })
  @ManyToOne(() => Assessment, (assessment) => assessment.subComponents)
  assessment: Assessment;

  @ApiProperty({
    description: 'ID of the associated sub-component',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @PrimaryColumn()
  @Index()
  subComponentId: string;

  @ApiProperty({
    description: 'Associated sub-component',
    type: () => SubComponent,
  })
  @ManyToOne(() => SubComponent, (subComponent) => subComponent.assessments)
  subComponent: SubComponent;
}
