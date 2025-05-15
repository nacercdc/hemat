import { registerDecorator, ValidationOptions } from 'class-validator';
import { ValueType } from '../types';
import { ObjectValueTypeInConstraint } from '../object-value-type-in.validator';

export function IsObjectValueTypeIn(
  types: [ValueType, ...ValueType[]],
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsObjectValueTypeIn',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [types],
      validator: ObjectValueTypeInConstraint,
    });
  };
}
