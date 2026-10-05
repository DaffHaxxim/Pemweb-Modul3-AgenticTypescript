# Latihan TypeScript (Modul 3, section 16)

Solutions for the 7 exercises in `../Materials/README.md`, section 16, built with the project setup
from section 2 and the run methods from section 14.

## Run

```bash
npm install          # installs typescript, @types/node, tsx (versions in package-lock.json)
npm run typecheck    # tsc --noEmit: type checking only
npm run build        # tsc: compiles src/ to dist/
npm start            # node dist/index.js
npm run dev          # tsx src/index.ts (runs .ts directly, does NOT type-check)
npx tsc -p notes     # type-checks the ORIGINAL Modul 2 code and the deliberate error demos (expected to fail)
```

Installed TypeScript is 7.0.2 (`npm install typescript` resolves to the latest release).

## Layout

| Path | Content |
| --- | --- |
| `src/01-basic-types.ts` ... `src/06-async.ts` | Exercises 1 to 6 |
| `src/07-refactor/fruits.ts`, `dom.ts` | Exercise 7, strict TypeScript versions |
| `src/index.ts` | Runner that prints the result of every exercise |
| `notes/06-async-discussion.md` | Exercise 6 discussion |
| `notes/07-refactor-errors.md` | Exercise 7 error log |
| `notes/07-original/` | Verbatim Modul 2 JavaScript used as the refactor input |
| `notes/compile-errors/` | Deliberately wrong code that proves the type-level requirements |
| `notes/tsconfig.json` | Extends the project config for the `notes/` folder |
| `GUIDE-Latihan-Typescript.md` | Full guide of this folder |

## Requirement checklist

Each box was ticked only after the command in the last column passed.

### Section 2 - project setup

- [x] `npm init -y` and `npm install typescript @types/node --save-dev` (plus `tsx` for section 14) - `package.json`
- [x] `npx tsc --init`, then `tsconfig.json` set to the recommended config (ES2022, NodeNext, rootDir `src`, outDir `dist`, `strict`, `noUncheckedIndexedAccess`, `skipLibCheck`, include `src`) - `tsconfig.json`
- [x] `src/` folder created
- [x] `"type": "module"` with `.js` extensions in relative imports (section 2 note) - `npm start` runs
- [x] Scripts `build`, `typecheck`, `start` - `npm run typecheck` exit 0, `npm run build` exit 0, `npm start` exit 0

### Section 16 - exercises

- [x] 1. `average(nums: number[])` handles `[]` with the return type `number | null` - `npm start` prints `null`; `notes/compile-errors/ex1-ex2-ex5-calls.ts` shows TS2322 when `null` is ignored
- [x] 2. `formatId(id: string | number): string` upper-cases strings and pads numbers to 6 digits - `npm start` prints `AB-12` and `000482`; TS2345 for `formatId(true)`
- [x] 3. `PaymentMethod` with `card`, `transfer`, `cash` and `describe()` with a `never` check - `npm start` prints all three; `notes/compile-errors/ex3-never.ts` shows TS2322 when a 4th variant is not handled
- [x] 4. `ProductSummary`, `ProductUpdate` (no `id`), `ReadonlyProduct` - `npm start`; `notes/compile-errors/ex4-utility.ts` shows TS2353 (extra field, `id` in update) and TS2540 (readonly assignment)
- [x] 5. `groupBy<T, K extends string | number>(...): Record<K, T[]>` - `npm start` groups by length (number key) and first letter (string key); TS2322 for a boolean key
- [x] 6. `fetchJson<T>(url): Promise<T>` throws `Error` when `res.ok` is `false` - `npm start` shows a real 404 turned into `Error`; discussion in `notes/06-async-discussion.md`
- [x] 7. Modul 2 "Intermediate JavaScript" converted to `strict`, errors recorded - `npx tsc -p notes` reports 15 errors on the original DOM code, 0 on the arrays/objects code; `notes/07-refactor-errors.md`; refactor passes `npm run typecheck`

### Section 14 - ways to run TypeScript

- [x] Compile then run: `npx tsc` then `node dist/index.js` (`npm run build`, `npm start`)
- [x] One-file quick compile: `npx tsc src/index.ts ...` produces `.js` next to the source and runs. Verified in a scratch copy WITHOUT a `tsconfig.json`. With a `tsconfig.json` present, TypeScript 7.0.2 refuses it with TS5112 (use `--ignoreConfig`), so this row differs from the module text
- [x] Run directly with `tsx`: `npm run dev` exit 0
- [x] Run directly with Bun: `bun src/index.ts` (Bun 1.3.14) exit 0; values identical to Node, only `console.log` formatting differs (quote style, line breaks)
- [x] Type check only: `npx tsc --noEmit` (`npm run typecheck`) exit 0

### Section 15 - reading error messages

- [x] Errors read from the last line upwards and mapped to causes and fixes: TS2322, TS2339, TS2345, TS7006, TS2304, TS2532 (and the null variants TS18047 / TS2531) - `notes/07-refactor-errors.md`
- [x] Causes were fixed; no `any`, `!`, `@ts-ignore` and no unexplained `as`. The single `as Record<K, T[]>` in `groupBy` and the `as T` in `fetchJson` carry an explaining comment (the `AGENTS.md` example in section 21 allows `as` only with a stated reason; section 12 uses the same `as` for `res.json()`)

## Known limits

- `dom.ts` is only type-checked; running it needs a browser.
- The 404 demo in `npm start` calls `https://jsonplaceholder.typicode.com/users/9999`. Without internet it prints the network error instead; the `data:` URL demos run offline.
