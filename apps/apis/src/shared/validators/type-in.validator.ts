import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValueType } from './types';

@ValidatorConstraint({ name: 'TypeInConstraint', async: false })
export class TypeInConstraint implements ValidatorConstraintInterface {
  validate(value: any, validationArguments: ValidationArguments) {
    const types: ValueType[] = validationArguments?.constraints[0] || [
      'string',
    ];

    return types.includes(typeof value);
  }

  defaultMessage(validationArguments: ValidationArguments) {
    const types: ValueType[] = validationArguments?.constraints[0] || 'string';
    const field: string = validationArguments?.property || 'field';
    return `${field} type must be one of the following [${types.join(', ')}]`;
  }
}
