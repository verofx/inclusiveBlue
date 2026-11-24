export const POINTS_PER_CERTIFICATE = 10;
export const POINTS_PER_CREDIT = 10;

export function creditsFor(points: number) {
  return Math.floor(points / POINTS_PER_CREDIT);
}
