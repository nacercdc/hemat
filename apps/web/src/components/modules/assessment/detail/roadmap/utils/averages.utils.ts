import type { RoadmapSubComponent } from "~/libs/models/roadmap.model";

export function calculateAverageCurrent(
  subComponents: RoadmapSubComponent[]
): number | null {
  const validValues = subComponents
    .map((sub) => sub.roadmap?.currentState)
    .filter((value): value is number => typeof value === "number");

  if (validValues.length === 0) return null;

  const total = validValues.reduce((acc, value) => acc + value, 0);
  return parseFloat((total / validValues.length).toFixed(2));
}
export function calculateAverageTarget(
  subComponents: RoadmapSubComponent[]
): number | null {
  const validValues = subComponents
    .map((sub) => sub.roadmap?.target)
    .filter((value): value is number => typeof value === "number");

  if (validValues.length === 0) return null;

  const total = validValues.reduce((acc, value) => acc + value, 0);
  return parseFloat((total / validValues.length).toFixed(2));
}
