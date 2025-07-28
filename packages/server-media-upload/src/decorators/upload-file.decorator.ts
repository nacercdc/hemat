import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

interface MulterRequest extends Request {
  file: Express.Multer.File;
  files: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}

type FilePropertyValue = string | number | boolean | Buffer | object | null;

export const UploadedFile = createParamDecorator(
  (
    data: string | undefined,
    ctx: ExecutionContext,
  ): Express.Multer.File | FilePropertyValue | null => {
    const request = ctx.switchToHttp().getRequest<MulterRequest>();
    const file = request.file;

    if (!file) return null;
    return data ? (file[data as keyof Express.Multer.File] ?? null) : file;
  },
);

export const UploadedFiles = createParamDecorator(
  (
    data: string | undefined,
    ctx: ExecutionContext,
  ): Express.Multer.File[] | Record<string, Express.Multer.File[]> | null => {
    const request = ctx.switchToHttp().getRequest<MulterRequest>();
    const files = request.files;

    if (!files) return null;

    if (Array.isArray(files)) {
      return data ? [] : files;
    }

    return data ? (files[data] ?? []) : files;
  },
);
