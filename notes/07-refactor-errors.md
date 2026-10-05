# Exercise 7 - Refactor Modul 2 "Intermediate JavaScript" to strict TypeScript

Task from Modul 3, section 16, item 7: take the JavaScript from the "Intermediate JavaScript"
section of Modul 2 (for example the `fruits` array code), convert it to TypeScript `strict`,
and note the errors that appear.

## Method

1. The code was copied verbatim from `Praktikum-2/Modul-2-JavaScript.md`:
   - sections 2.1 and 2.2 (arrays, objects) to `notes/07-original/fruits.original.ts`
   - section 2.3 (DOM) to `notes/07-original/dom.original.ts`
2. Both were type-checked with the project settings (`strict` and `noUncheckedIndexedAccess`):
   `notes/tsconfig.json` extends `../tsconfig.json`, run with `npx tsc -p notes`.
3. Each error was fixed in `src/07-refactor/fruits.ts` and `src/07-refactor/dom.ts` using only
   the fixes the module teaches (null check, `instanceof`, parameter annotation).

## Result for arrays and objects (sections 2.1 and 2.2)

Zero errors. `let fruits = ["🍏", "🍉", "🍊"]` is inferred as `string[]` (module section 3.2), every
method call matches its signature, and `this.name` inside an object literal method is typed from the
literal. The refactor only made the inferred types explicit. This is a real finding: not every
JavaScript snippet breaks under `strict`.

## Result for the DOM code (section 2.3): 15 errors

Raw output of `npx tsc -p notes` for `dom.original.ts`:

```text
dom.original.ts(12,1): error TS18047: 'title' is possibly 'null'.
dom.original.ts(13,1): error TS18047: 'title' is possibly 'null'.
dom.original.ts(17,1): error TS18047: 'content' is possibly 'null'.
dom.original.ts(22,1): error TS18047: 'form' is possibly 'null'.
dom.original.ts(24,22): error TS2531: Object is possibly 'null'.
dom.original.ts(24,60): error TS2339: Property 'value' does not exist on type 'HTMLElement'.
dom.original.ts(29,1): error TS18047: 'title' is possibly 'null'.
dom.original.ts(30,1): error TS18047: 'title' is possibly 'null'.
dom.original.ts(34,1): error TS18047: 'box' is possibly 'null'.
dom.original.ts(35,1): error TS18047: 'box' is possibly 'null'.
dom.original.ts(38,21): error TS7006: Parameter 'id' implicitly has an 'any' type.
dom.original.ts(43,1): error TS2304: Cannot find name 'button'.
dom.original.ts(50,1): error TS18047: 'parentElement' is possibly 'null'.
dom.original.ts(50,27): error TS2345: Argument of type 'HTMLElement | null' is not assignable to parameter of type 'Node'.
  Type 'null' is not assignable to type 'Node'.
dom.original.ts(62,3): error TS2532: Object is possibly 'undefined'.
```

### Grouped, with cause and fix

| Code | Count | Cause | Fix used | Module reference |
| --- | --- | --- | --- | --- |
| TS18047 / TS2531 | 10 | `getElementById` returns `HTMLElement \| null`; the original uses the result directly | `if (el) { ... }` | section 8 |
| TS2339 | 1 | `.value` exists on `HTMLInputElement`, not on `HTMLElement` | `if (input instanceof HTMLInputElement)` | section 9.4 |
| TS7006 | 1 | `function changeText(id)` has an untyped parameter | `id: HTMLElement` | section 15 table |
| TS2304 | 1 | `button` is used but never declared in the snippet | look it up with `getElementById` and check it | section 15 table |
| TS2345 | 1 | `removeChild(childElement)` receives `HTMLElement \| null` | check both parent and child before calling | section 8 |
| TS2532 | 1 | `divs[i]` is `T \| undefined` because of `noUncheckedIndexedAccess` | `const div = divs[i]; if (div) { ... }` | section 2 (option table) |

Notes:

- TS18047 and TS2531 are the "possibly null" forms. The module's section 15 table lists the
  "possibly undefined" forms (TS18048 and TS2532), which is the same family with `undefined`
  instead of `null`. The line 62 error is the `undefined` form.
- No `any`, `as`, `!` or `@ts-ignore` was used in the fixes (module sections 15 and 26 say
  to fix the cause, not silence the compiler).
- One edit was made to the original code for the check: the second `paragraphs` declaration
  (section 2.3.10) is wrapped in a block, because all snippets share one file and the repeated
  `const` name would add a redeclaration error that comes from concatenation, not from the code.

## After the fix

`npm run typecheck` (which includes `src/07-refactor/*.ts`) exits 0.
`fruits.ts` also runs: `npm start` prints the same values as the original snippet.
`dom.ts` is type-checked only, because Node has no `document`.
