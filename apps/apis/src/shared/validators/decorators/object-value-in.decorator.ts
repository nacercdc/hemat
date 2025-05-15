import { registerDecorator, ValidationOptions } from 'class-validator';
import { ObjectValueInConstraint } from '../object-value-in.validator';

export function IsObjectValueIn(
  entity: string[],
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsObjectValueIn',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity],
      validator: ObjectValueInConstraint,
    });
  };
}
