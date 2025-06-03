import { registerDecorator, ValidationOptions } from 'class-validator';
import { ObjectKeyInConstraint } from '../object-key-in.validator';

export function IsObjectKeyIn(
  entity: string[],
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsObjectKeyIn',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity],
      validator: ObjectKeyInConstraint,
    });
  };
}
