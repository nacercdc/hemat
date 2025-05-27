export class DescriptionTranslationDto {
  description: Record<string, string>;
}

export class NameDescriptionDto extends DescriptionTranslationDto {
  name: Record<string, string>;
}

export class AssessmentTranslationDto extends NameDescriptionDto {
  code: Record<string, string>;
}
