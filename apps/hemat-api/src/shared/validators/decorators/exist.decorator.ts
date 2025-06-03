import { registerDecorator, ValidationOptions } from 'class-validator';
import { ExistOptions } from '../types';
import { ExistConstraint } from '../exist.validator';

export function IsExists(
  options: ExistOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: ExistConstraint,
    });
  };
}
