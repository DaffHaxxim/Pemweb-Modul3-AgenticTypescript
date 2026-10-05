// Exercise 1 - Basic types.
// An empty array has no mean. Returning 0 would claim "the average is zero" and NaN
// silently poisons later arithmetic, so the honest return type is `number | null`.
// Callers must handle null (enforced by strictNullChecks).
export function average(nums: number[]): number | null {
  if (nums.length === 0) return null;
  let sum = 0;
  for (const n of nums) sum += n;
  return sum / nums.length;
}
