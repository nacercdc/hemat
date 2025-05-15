import { registerDecorator, ValidationOptions } from 'class-validator';
import { ExistOptions } from '../types';
import { UniqueConstraint } from '../unique.validator';

export function IsUnique(
  options: ExistOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsUnique',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [options],
      validator: UniqueConstraint,
    });
  };
}
