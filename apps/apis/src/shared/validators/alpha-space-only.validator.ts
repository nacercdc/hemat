import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'AlphaSpaceOnlyConstraint', async: false })
export class AlphaSpaceOnlyConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    const regex = /^[A-Za-z ]+$/;
    return regex.test(value);
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    const field: string = validationArguments?.property || 'field';
    return `${field} must contain only alphabets and spaces.`;
  }
}
