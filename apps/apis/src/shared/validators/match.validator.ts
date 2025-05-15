import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'MatchConstraint' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, validationArguments: ValidationArguments) {
    const [relatedPropertyName] = validationArguments.constraints;
    const relatedValue = (validationArguments.object as any)[
      relatedPropertyName
    ];
    return value === relatedValue;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    const [relatedPropertyName] =
      validationArguments?.constraints || 'related filed';
    const field: string = validationArguments?.property || 'field';
    return `${field} do not match ${relatedPropertyName}`;
  }
}
