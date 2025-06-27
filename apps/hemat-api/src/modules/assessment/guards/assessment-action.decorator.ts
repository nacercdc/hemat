import { SetMetadata } from '@nestjs/common';
export const ASSESSMENT_ACTION_KEY = 'assessment:action';
export const AssessmentAction = (action: string) => SetMetadata(ASSESSMENT_ACTION_KEY, action); 