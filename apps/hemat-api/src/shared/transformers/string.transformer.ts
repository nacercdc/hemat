import { TransformFnParams } from 'class-transformer/types/interfaces';

export const lowerCaseTransformer = (
  params: TransformFnParams,
): string | null => params.value?.toLowerCase().trim() || null;

export const ucFirst = (str: string): string | null => {
  if (!str) return null;

  return str?.toLowerCase().charAt(0).toUpperCase() + str.substring(1);
};

export const ucWord = (sentence: string): string | null => {
  if (!sentence) return null;

  const words = sentence.toLowerCase().split(' ');

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substring(1);
  }

  return words.join(' ');
};

export const camelCaseTransformer = (str: string): string | null => {
  if (!str) return null;

  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index == 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');
};

export const formatByteSize = (value: number): string => {
  if (!value || typeof value !== 'number') return '0 Bytes';

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const index = Math.floor(Math.log(value) / Math.log(1024));
  return `${Math.round(value / Math.pow(1024, index))} ${sizes[index]}`;
};
