import { SetMetadata } from '@nestjs/common';

export const ASSESSMENT_PERMISSIONS_KEY = 'assessment:permissions';

export const AssessmentAbility = (actions: string[]) =>
  SetMetadata(ASSESSMENT_PERMISSIONS_KEY, actions); 