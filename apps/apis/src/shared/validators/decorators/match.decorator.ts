import { registerDecorator, ValidationOptions } from 'class-validator';
import { MatchConstraint } from '../match.validator';

export function IsMatch(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsMatch',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}
