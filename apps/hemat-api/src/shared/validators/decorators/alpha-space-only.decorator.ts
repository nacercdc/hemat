import { registerDecorator, ValidationOptions } from 'class-validator';
import { AlphaSpaceOnlyConstraint } from '../alpha-space-only.validator';

export function IsAlphaSpaceOnly(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsAlphaSpaceOnly',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: AlphaSpaceOnlyConstraint,
    });
  };
}
