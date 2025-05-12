import { Entity, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityWithSoftDelete } from './entity';
import { Component } from './component.entity';

@Entity('domains')
export class Domain extends BaseEntityWithSoftDelete {
  @ApiProperty({
    description: 'Unique code of the domain',
    example: '1',
    type: String,
  })
  @Column({ unique: true })
  code: string;

  @ApiProperty({
    description: 'Name of the domain',
    example: 'Public Health',
    type: String,
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Description of the domain',
    example: 'Domain covering public health initiatives',
    type: String,
  })
  @Column()
  description: string;

  @ApiProperty({
    description: 'Whether the domain is active',
    example: true,
    type: Boolean,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Components under this domain',
    type: () => [Component],
  })
  @OneToMany(() => Component, (component) => component.domain)
  components: Component[];
}
