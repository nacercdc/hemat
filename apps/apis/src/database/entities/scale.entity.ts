import { Entity, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Measurement } from './measurement.entity';

@Entity('scales')
export class Scale extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'ID of the associated measurement',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column()
  measurementId: string;

  @ApiProperty({
    description: 'Associated measurement',
    type: () => Measurement,
  })
  @ManyToOne(() => Measurement, (measurement) => measurement.scales)
  measurement: Measurement;

  @ApiProperty({
    description: 'Rate of the scale',
    example: 3,
    type: Number,
  })
  @Column()
  rate: number;
}
