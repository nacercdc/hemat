import { registerDecorator, ValidationOptions } from 'class-validator';
import { TypeInConstraint } from '../type-in.validator';
import { ValueType } from '../types';

export function IsTypeIn(
  types: [ValueType, ...ValueType[]],
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsTypeIn',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [types],
      validator: TypeInConstraint,
    });
  };
}
