import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValueType } from './types';

@ValidatorConstraint({ name: 'ObjectValueTypeInConstraint' })
export class ObjectValueTypeInConstraint
  implements ValidatorConstraintInterface
{
  validate(record: Object, validationArguments: ValidationArguments): boolean {
    if (typeof record !== 'object') return false;

    const values = Object.values(record || {});
    const types: ValueType[] = validationArguments?.constraints[0] || [
      'string',
    ];

    for (const value of values) {
      if (types.includes(typeof value)) {
        continue;
      }

      return false;
    }

    return true;
  }

  defaultMessage(validationArguments: ValidationArguments) {
    const types: ValueType[] = validationArguments?.constraints[0] || 'string';
    const field: string = validationArguments?.property || 'field';
    return `${field} value type must be one of the following [${types.join(', ')}]`;
  }
}
