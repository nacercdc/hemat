import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Scale } from './scale.entity';
import { Answer } from './answer.entity';
import { Roadmap } from './roadmap.entity';
import { MeasurementScaleDescription } from './measurement-scale-description.entity';

@Entity('measurements')
export class Measurement extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'Name of the measurement',
    example: 'Effectiveness',
    type: String,
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Description of the measurement',
    example: 'Measures the effectiveness of interventions',
    type: String,
  })
  @Column()
  description: string;

  @ApiProperty({
    description: 'Color associated with the measurement',
    example: '#FF0000',
    type: String,
  })
  @Column()
  color: string;

  @ApiProperty({
    description: 'Rate of the measurement',
    example: 5,
    type: Number,
  })
  @Column()
  rate: number;

  @ApiProperty({
    description: 'Scale Object',
    type: () => [Scale],
  })
  @OneToMany(() => Scale, (scale) => scale.measurement)
  scales: Scale[];

  @ApiPropertyOptional({
    description: 'Answer object',
    type: () => Answer,
  })
  @OneToOne(() => Answer, (answers) => answers.measurement)
  answers: Answer | null;

  @ApiProperty({
    description: 'Roadmaps linked to this Measurement',
    type: () => [Roadmap],
  })
  @OneToMany(() => Roadmap, (roadmap) => roadmap.measurement)
  roadmaps: Roadmap[];

  @ApiProperty({
    description: 'MeasurementScaleDescription linked to this SubComponent',
    type: () => [MeasurementScaleDescription],
  })
  @OneToMany(
    () => MeasurementScaleDescription,
    (measurementScaleDescription) => measurementScaleDescription.measurement,
  )
  measurementScaleDescription: MeasurementScaleDescription[];
}
