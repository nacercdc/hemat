import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'ObjectValueInConstraint' })
export class ObjectValueInConstraint implements ValidatorConstraintInterface {
  validate(record: Object, validationArguments: ValidationArguments): boolean {
    if (typeof record !== 'object') return false;

    const values = Object.values(record || {});
    const entities: string[] = validationArguments?.constraints[0] || [];

    for (const value of values) {
      if (entities.includes(value)) {
        continue;
      }

      return false;
    }

    return true;
  }

  defaultMessage(validationArguments: ValidationArguments) {
    const entities: string[] = validationArguments?.constraints[0] || [];
    const field: string = validationArguments?.property || 'field';
    return `${field} value must be one of the following [${entities.join(', ')}]`;
  }
}
