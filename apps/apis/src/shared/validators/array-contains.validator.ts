import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({
  name: 'ArrayContainsConstraint',
  async: true,
})
export class ArrayContainsConstraint implements ValidatorConstraintInterface {
  async validate(
    values: string[],
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const fields = new Set(validationArguments?.constraints[0] ?? []);
    const invalidFields = values.filter((value) => !fields.has(value));
    return invalidFields.length < 1;
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    const property: string = validationArguments.property;
    const fields: string[] = validationArguments.constraints[0] ?? [];
    return `${property} must be one of the following ${fields.join(',')}`;
  }
}
