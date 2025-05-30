import { registerDecorator, ValidationOptions } from 'class-validator';
import { ArrayContainsConstraint } from '../array-contains.validator';

export function IsArrayContains(
  options: [string, ...string[]],
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsArrayContains',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: ArrayContainsConstraint,
    });
  };
}
