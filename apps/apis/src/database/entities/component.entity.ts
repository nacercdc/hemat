import { Entity, Column, ManyToOne, OneToMany, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
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
    description: 'Associated domain',
    type: () => Domain,
  })
  @ManyToOne(() => Domain, (domain) => domain.components)
  @Index()
  domain: Domain;

  @ApiProperty({
    description: 'Sub-components under this component',
    type: () => [SubComponent],
  })
  @OneToMany(() => SubComponent, (subComponent) => subComponent.component)
  subComponents: SubComponent[];
}
