import { DataSource } from 'typeorm';
import { AssessmentSubComponentAnswer, AssessmentSubComponentRoadmap, AssessmentSubComponent } from '@database/entities';

export class PercentageUtil {
  static async calculatePercentage(
    assessmentId: string,
    entityId: string,
    manager: DataSource['manager'],
    entityType: 'Answer' | 'Roadmap',
  ): Promise<number> {
    const totalSubComponents = await manager.count(AssessmentSubComponent, {
      where: { assessmentId },
    });

    if (totalSubComponents === 0) {
      return 0;
    }

    const answeredSubComponents = await manager.count(
      entityType === 'Answer'
        ? AssessmentSubComponentAnswer
        : AssessmentSubComponentRoadmap,
      {
        where: { 
          [entityType === 'Answer' ? 'answerId' : 'roadmapId']: entityId,
        },
      },
    );

    const percentage = Math.min(
      (answeredSubComponents / totalSubComponents) * 100,
      100,
    );
    return Math.round(percentage * 100) / 100;
  }
}