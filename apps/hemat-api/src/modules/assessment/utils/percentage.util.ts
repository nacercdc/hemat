import { DataSource } from 'typeorm';
import { AssessmentSubComponentAnswer, AssessmentSubComponentRoadmap, AssessmentSubComponent } from '@database/entities';

export class PercentageUtil {
  static async calculatePercentage(
    assessmentId: string,
    entityId: string,
    manager: DataSource['manager'],
    entityType: 'Answer' | 'Roadmap',
  ): Promise<number> {
    // Count total subcomponents for the assessment
    const totalSubComponents = await manager.count(AssessmentSubComponent, {
      where: { assessmentId },
    });

    // If no subcomponents exist, return 0 to avoid division by zero
    if (totalSubComponents === 0) {
      return 0;
    }

    // Count answered subcomponents for the given entity
    const answeredSubComponents = await manager.count(
      entityType === 'Answer' ? AssessmentSubComponentAnswer : AssessmentSubComponentRoadmap,
      {
        where: { [entityType === 'Answer' ? 'answerId' : 'roadmapId']: entityId },
      },
    );

    // Calculate percentage (answered / total * 100), capped at 100, rounded to 2 decimal places
    const percentage = Math.min((answeredSubComponents / totalSubComponents) * 100, 100);
    return Math.round(percentage * 100) / 100; // e.g., 33.33, 66.67, 100.00
  }
}