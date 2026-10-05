// Exercise 2 - Union + narrowing.
// `typeof id === "string"` narrows the union: in the if-branch `id` is string,
// afterwards TypeScript knows it can only be number.
export function formatId(id: string | number): string {
  if (typeof id === "string") {
    return id.toUpperCase();
  }
  return String(id).padStart(6, "0");
}
