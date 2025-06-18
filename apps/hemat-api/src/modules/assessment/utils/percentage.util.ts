import { EntityManager } from 'typeorm';
import {
  AssessmentSubComponent,
  AssessmentSubComponentAnswer,
} from '@database/entities';

/**
 * Utility class for calculating the completion percentage of an answer.
 */
export class PercentageUtil {
  /**
   * Calculates the percentage of sub-components filled for a specific answer.
   * @param assessmentId The ID of the assessment.
   * @param answerId The ID of the answer.
   * @param manager The TypeORM entity manager (optional, defaults to transaction manager).
   * @returns The percentage (0-100) of filled sub-components.
   */
  static async calculatePercentage(
    assessmentId: string,
    answerId: string,
    manager: EntityManager,
  ): Promise<number> {
    // Count total sub-components for the assessment
    const totalSubComponents = await manager.count(AssessmentSubComponent, {
      where: { assessmentId },
    });

    // Count filled sub-components for the specific answer
    const filledSubComponents = await manager.count(
      AssessmentSubComponentAnswer,
      {
        where: { answerId },
      },
    );

    // Return 0 if no sub-components exist, otherwise calculate percentage
    return totalSubComponents === 0
      ? 0
      : (filledSubComponents / totalSubComponents) * 100;
  }
}
