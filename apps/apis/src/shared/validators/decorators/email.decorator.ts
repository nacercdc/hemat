import { registerDecorator, ValidationOptions } from 'class-validator';
import { EmailConstraint } from '../email.validator';

export function IsEmail(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsEmail',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: EmailConstraint,
    });
  };
}
