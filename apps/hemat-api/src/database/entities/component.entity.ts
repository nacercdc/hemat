import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ComponentTranslationDto } from '@shared/dtos';
import { BaseEntityWithSoftDelete } from './entity';
import { Domain } from './domain.entity';
import { SubComponent } from './sub-component.entity';

@Entity('components')
export class Component extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'Unique code of the component',
    example: '1.A',
    type: String,
  })
  @Column({ unique: true })
  code: string;

  @ApiProperty({
    description: 'Name of the component',
    example: 'Vaccination Program',
    type: String,
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Description of the component',
    example: 'Component for vaccination initiatives',
    type: String,
  })
  @Column()
  description: string;

  @ApiProperty({
    description: 'Whether the component is active',
    example: true,
    type: Boolean,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Assessments related to this Components',
    type: () => ComponentTranslationDto,
  })
  @Column('jsonb')
  translations: Record<string, ComponentTranslationDto> = {};

  @ApiProperty({
    description: 'ID of the associated domain',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  @Column({ type: 'uuid' })
  @Index()
  domainId: string;

  @ManyToOne(() => Domain, (domain) => domain.components)
  @JoinColumn({ name: 'domainId' })
  domain: Domain;

  @OneToMany(() => SubComponent, (subComponent) => subComponent.component)
  subComponents: SubComponent[];
}
