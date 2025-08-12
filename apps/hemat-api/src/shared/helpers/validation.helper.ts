import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { ClassConstructor } from 'class-transformer/types/interfaces';

export function validateConfig<T extends object>(
  config: Record<string, unknown>,
  envVariablesClass: ClassConstructor<T>,
) {
  const validatedConfig = plainToClass(envVariablesClass, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}

export const VALIDATION_OPTIONS: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (validationErrors: ValidationError[]) => {
    const errors = generateErrors(validationErrors);
    const message =
      Object.values<string[]>(errors)[0]?.[0] ??
      'common.exception.validationError';

    return new UnprocessableEntityException({ message, errors });
  },
};

function generateErrors(
  errors: ValidationError[],
  parent?: string,
): Record<string, string[]> {
  return errors.reduce((acc: Record<string, string[]>, current) => {
    let property = parent ? `${parent}.${current.property}` : current.property;

    if (current.children?.length) {
      return generateErrors(current.children, property);
    }

    acc[property] = Object.values<string>(current.constraints ?? {});

    return acc;
  }, {});
}
