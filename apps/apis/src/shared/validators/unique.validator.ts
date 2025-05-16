import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { DataSource } from 'typeorm';

interface UniqueValidationOptions {
  tableName: string;
  columns: string[];
  exclude?: string;
}

@ValidatorConstraint({ name: 'isUnique', async: true })
@Injectable()
export class UniqueConstraint implements ValidatorConstraintInterface {
  private readonly logger = new Logger(UniqueConstraint.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.logger.log(`DataSource initialized: ${this.dataSource.isInitialized}`);
  }

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const options: UniqueValidationOptions = args.constraints[0];
    this.logger.debug(
      `Validating uniqueness for value: ${value}, options: ${JSON.stringify(options)}`,
    );

    if (!value || !this.dataSource.isInitialized) {
      this.logger.warn(
        `Skipping validation: value=${value}, DataSource initialized=${this.dataSource.isInitialized}`,
      );
      return true;
    }

    if (
      !options ||
      typeof options.tableName !== 'string' ||
      !options.columns?.length
    ) {
      this.logger.error(
        `Invalid validation options: ${JSON.stringify(options)}`,
      );
      throw new Error(
        'Invalid tableName or columns provided to UniqueConstraint',
      );
    }

    const { tableName, columns, exclude } = options;
    const object = args.object as any;

    try {
      const queryBuilder = this.dataSource
        .getRepository(tableName)
        .createQueryBuilder(tableName);

      columns.forEach((column, index) => {
        const paramName = `param${index}`;
        queryBuilder.andWhere(`${tableName}.${column} = :${paramName}`, {
          [paramName]: value,
        });
      });

      if (exclude && object[exclude]) {
        queryBuilder.andWhere(`${tableName}.${exclude} != :exclude`, {
          exclude: object[exclude],
        });
      }

      const count = await queryBuilder.getCount();
      return count === 0;
    } catch (error) {
      this.logger.error(
        `Failed to validate uniqueness for ${tableName}: ${error.message}`,
      );
      throw new Error(`Failed to validate uniqueness: ${error.message}`);
    }
  }

  defaultMessage(args: ValidationArguments): string {
    const options: UniqueValidationOptions = args.constraints[0];
    return `${args.property} must be unique in ${options.tableName}`;
  }
}
