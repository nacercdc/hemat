import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@ValidatorConstraint({ name: 'unique', async: true })
@Injectable()
export class UniqueConstraint implements ValidatorConstraintInterface {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    if (!value) return true; // Skip validation if value is empty

    const [entity, field] = args.constraints;
    if (!this.dataSource) {
      throw new Error('DataSource is not initialized in UniqueConstraint');
    }

    try {
      const repository = this.dataSource.getRepository(entity);
      const count = await repository.count({ where: { [field]: value } });
      return count === 0;
    } catch (err) {
      console.error('UniqueConstraint validation error:', err);
      throw new Error('Failed to validate uniqueness');
    }
  }

  defaultMessage(args: ValidationArguments): string {
    const [entity, field] = args.constraints;
    return `${field} already exists in ${entity.name}`;
  }
}
