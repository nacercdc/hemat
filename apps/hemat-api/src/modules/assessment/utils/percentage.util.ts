import { DataSource, In } from 'typeorm';
import { AssessmentSubComponentAnswer, AssessmentSubComponentRoadmap, AssessmentSubComponent } from '@database/entities';

export class PercentageUtil {
  static async calculatePercentage(
    assessmentId: string,
    entityId: string,
    manager: DataSource['manager'],
    entityType: 'Answer' | 'Roadmap',
    allowedDomainIds?: string[],
  ): Promise<number> {
    // Only count subcomponents in allowed domains if provided
    const subComponentWhere: Record<string, any> = { assessmentId };
    if (allowedDomainIds && allowedDomainIds.length > 0) {
      subComponentWhere.domainId = allowedDomainIds.length === 1 ? allowedDomainIds[0] : allowedDomainIds;
    }
    const totalSubComponents = await manager.count(AssessmentSubComponent, {
      where: subComponentWhere,
    });

    if (totalSubComponents === 0) {
      return 0;
    }

    // Only count answers for subcomponents in allowed domains if provided
    let answeredSubComponents = 0;
    if (allowedDomainIds && allowedDomainIds.length > 0) {
      // Find subcomponent IDs in allowed domains
      const subComponents: AssessmentSubComponent[] = await manager.find(AssessmentSubComponent, {
        where: subComponentWhere,
        select: ['id'],
      });
      const subComponentIds: string[] = subComponents.map((sc: AssessmentSubComponent) => sc.id);
      if (subComponentIds.length === 0) return 0;
      answeredSubComponents = await manager.count(
        entityType === 'Answer'
          ? AssessmentSubComponentAnswer
          : AssessmentSubComponentRoadmap,
        {
          where: {
            [entityType === 'Answer' ? 'answerId' : 'roadmapId']: entityId,
            subComponentId: subComponentIds.length === 1 ? subComponentIds[0] : In(subComponentIds),
          },
        },
      );
    } else {
      answeredSubComponents = await manager.count(
        entityType === 'Answer'
          ? AssessmentSubComponentAnswer
          : AssessmentSubComponentRoadmap,
        {
          where: {
            [entityType === 'Answer' ? 'answerId' : 'roadmapId']: entityId,
          },
        },
      );
    }

    const percentage = Math.min(
      (answeredSubComponents / totalSubComponents) * 100,
      100,
    );
    return Math.round(percentage * 100) / 100;
  }
}