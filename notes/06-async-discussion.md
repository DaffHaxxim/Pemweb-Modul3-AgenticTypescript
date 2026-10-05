# Exercise 6 - What does `T` NOT guarantee in `fetchJson<T>`?

Question from Modul 3, section 16, item 6: "Diskusikan: apa yang *tidak* dijamin oleh `T` di sini?"

Code: `src/06-async.ts`

```ts
export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request to ${url} failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}
```

## Short answer

`T` guarantees nothing about the data. It only tells the compiler what to assume. The line
`(await res.json()) as T` is a type assertion (module section 9.4, and section 12 which says
`as User` "tidak memvalidasi isi respons"). Types are erased at runtime, so no check ever
compares the real JSON with `T`.

## What is not guaranteed

| Not guaranteed | Why |
| --- | --- |
| The body has the properties of `T` | `res.json()` is typed `Promise<any>`, and `any` is assignable to every `T`. |
| The properties have the right types (`id` is a number, not a string) | Nothing inspects the values. |
| The body is an object at all | JSON can be `null`, a number, a string or an array and the assertion still passes. |
| The body is valid JSON | If it is not, `res.json()` rejects with a `SyntaxError`; the return type `Promise<T>` does not show this. |
| The request succeeded at the network level | `fetch` rejects with a `TypeError` on network failure. `res.ok` only covers HTTP status codes 200-299. |

## Observed, not just argued

`src/index.ts` (section 6) fetches two `data:` URLs (answered by `fetch` itself, no network needed) with
the same type argument `User { id: number; name: string }`:

```text
ok body        : Alice
wrong-shape body, user.name = undefined (compiler believes: string)
```

The second body is `{"unexpected":true}`. The call compiles and returns normally, `user.name` is
typed `string`, and at runtime it is `undefined`. A crash such as `wrong.name.toUpperCase()` would
appear later, far from the real cause.

The `res.ok === false` path was observed against a real HTTP 404:

```text
Gagal: Request to https://jsonplaceholder.typicode.com/users/9999 failed: 404 Not Found
```

## What to do about it (from the module)

- Treat data from outside as `unknown` and check it before use (module section 9.2: `typeof`, `"name" in raw`).
- Or validate the shape at runtime with a schema library or a manual check (module section 12).
- Keep the `as T` in one place, with a comment saying why it is trusted.
