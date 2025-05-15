import {
  isEmail,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'EmailConstraint' })
export class EmailConstraint implements ValidatorConstraintInterface {
  validate(value: string, _validationArguments: ValidationArguments) {
    return isEmail(value);
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const field: string = validationArguments?.property || 'field';
    return `${field} is not a valid email address`;
  }
}
