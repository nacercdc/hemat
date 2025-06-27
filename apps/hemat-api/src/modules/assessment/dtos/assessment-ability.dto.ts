import { ApiProperty } from '@nestjs/swagger';

export class AssessmentAbilityDto {
  @ApiProperty({
    description: 'Allowed actions for the assessment member',
    type: [String],
    example: ['read', 'create', 'update'],
  })
  actions: string[];

  @ApiProperty({
    description: 'Role of the member in the assessment',
    type: String,
    example: 'team-leader',
  })
  assessmentRole: string;

  @ApiProperty({
    description: 'Group ID of the member in the assessment',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
    nullable: true,
  })
  assessmentGroupId?: string;

  constructor(actions: string[], assessmentRole: string, assessmentGroupId?: string) {
    this.actions = actions;
    this.assessmentRole = assessmentRole;
    this.assessmentGroupId = assessmentGroupId;
  }
} 