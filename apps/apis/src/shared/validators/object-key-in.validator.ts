import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'ObjectKeyInConstraint' })
export class ObjectKeyInConstraint implements ValidatorConstraintInterface {
  validate(record: Object, validationArguments: ValidationArguments): boolean {
    if (typeof record !== 'object') return false;

    const keys = Object.keys(record || {});
    const entities: string[] = validationArguments?.constraints[0] || [];

    for (const key of keys) {
      if (entities.includes(key)) {
        continue;
      }

      return false;
    }

    return true;
  }

  defaultMessage(validationArguments: ValidationArguments) {
    const entities: string[] = validationArguments?.constraints[0] || [];
    const field: string = validationArguments?.property || 'field';
    return `${field} key must be one of the following [${entities.join(', ')}]`;
  }
}
