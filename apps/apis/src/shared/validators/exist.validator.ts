import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityManager, In } from 'typeorm';
import { ExistOptions } from './types';

@Injectable()
@ValidatorConstraint({ name: 'ExistConstraint', async: true })
export class ExistConstraint implements ValidatorConstraintInterface {
  constructor(private readonly entityManager: EntityManager) {}
  async validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const { tableName, columns }: ExistOptions =
      validationArguments?.constraints[0];
    let query = this.entityManager
      .getRepository(tableName)
      .createQueryBuilder(tableName);

    for (const [index, column] of columns.entries()) {
      if (index === 0) {
        query = query.where({
          [column]: Array.isArray(value) ? In(value) : value,
        });
        continue;
      }

      query = query.orWhere({
        [column]: Array.isArray(value) ? In(value) : value,
      });
    }

    const dataExist = await query.getExists().catch(() => false);

    return dataExist;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const field: string = validationArguments?.property || 'field';
    return `${field} not found`;
  }
}
