// Exercise 6 - Async.
// `res.ok` is false for any status outside 200-299 (fetch only rejects on network
// failure), so it must be checked explicitly and turned into an Error.
//
// Discussion: `T` is a promise to the compiler, not a check at runtime.
// `res.json()` returns `Promise<any>`, and `any` is assignable to any `T`, so the
// call below type-checks whatever the server really sends. See
// notes/06-async-discussion.md for a demonstration.
export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request to ${url} failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}
