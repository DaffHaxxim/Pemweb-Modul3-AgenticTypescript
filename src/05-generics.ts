// Exercise 5 - Generics.
// T is the item type, K is whatever key the callback produces. The constraint
// `K extends string | number` is required because Record<K, ...> only accepts
// keys that are valid property names.
export function groupBy<T, K extends string | number>(
  items: T[],
  key: (item: T) => K,
): Record<K, T[]> {
  // Built as Partial because the object starts empty and keys appear one by one.
  const result: Partial<Record<K, T[]>> = {};
  for (const item of items) {
    const k = key(item);
    const bucket = result[k];
    if (bucket) {
      bucket.push(item);
    } else {
      result[k] = [item];
    }
  }
  // Boundary assertion: every key that exists was filled, but TypeScript cannot
  // prove that for an open key type K, so the Partial is narrowed back once, here.
  return result as Record<K, T[]>;
}
