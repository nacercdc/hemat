import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AssessmentSubComponentService } from '../services/assessment-sub-component.service';
import { SubComponentAnswerUpdatedEvent } from '../events/assessment-answer.events';
import { ASSESSMENT_ANSWER_EVENTS } from '../events/assessment-answer.events.constants';

@Injectable()
export class AssessmentAnswerListener {
  constructor(private readonly subComponentService: AssessmentSubComponentService) {}

  @OnEvent(ASSESSMENT_ANSWER_EVENTS.SUBCOMPONENT_UPDATED)
  async handleSubComponentAnswerUpdated(event: SubComponentAnswerUpdatedEvent) {
    await this.subComponentService.updateAverageRateForAnswer(event.answerId);
  }
} 