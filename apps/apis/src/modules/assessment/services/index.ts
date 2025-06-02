import { AssessmentService } from './assessment.service';
import { AssessmentDomainService } from './assessment-domain.service';
import { AssessmentComponentService } from './assessment-component.service';
import { AssessmentSubComponentService } from './assessment-sub-component.service';
import { AssessmentMeasurementScaleService } from './assessment-measuremnt-scale.service';
import { AssessmentMeasurementScaleSubComponentService } from './assessment-measuremnt-scale-sub-component.service';
import { AssessmentGroupService } from './assessment-group.service';
import { AssessmentMemberService } from './assessment-member.service';

export {
  AssessmentService,
  AssessmentDomainService,
  AssessmentComponentService,
  AssessmentGroupService,
  AssessmentMeasurementScaleService,
  AssessmentMeasurementScaleSubComponentService,
  AssessmentMemberService,
  AssessmentSubComponentService,
};

export const ASSESSMENT_SERVICES = [
  AssessmentService,
  AssessmentDomainService,
  AssessmentComponentService,
  AssessmentGroupService,
  AssessmentMeasurementScaleService,
  AssessmentMeasurementScaleSubComponentService,
  AssessmentMemberService,
  AssessmentSubComponentService,
];
