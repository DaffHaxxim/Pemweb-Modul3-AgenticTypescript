// Runs every exercise of Modul 3, section 16 and prints the results.
// Type correctness is checked separately with `npm run typecheck` (module section 14).
import { average } from "./01-basic-types.js";
import { formatId } from "./02-union-narrowing.js";
import { describe, type PaymentMethod } from "./03-discriminated-union.js";
import { applyUpdate, type Product, type ProductSummary, type ProductUpdate, type ReadonlyProduct } from "./04-utility-types.js";
import { groupBy } from "./05-generics.js";
import { fetchJson } from "./06-async.js";

console.log("--- 1. Basic types");
console.log("average([1, 2, 3, 4]) =", average([1, 2, 3, 4]));
console.log("average([])           =", average([]));

console.log("--- 2. Union + narrowing");
console.log('formatId("ab-12") =', formatId("ab-12"));
console.log("formatId(482)     =", formatId(482));

console.log("--- 3. Discriminated union");
const payments: PaymentMethod[] = [
  { kind: "card", brand: "Visa", last4: "4242" },
  { kind: "transfer", bank: "BCA", accountNo: "1234567890" },
  { kind: "cash", amount: 50000 },
];
for (const p of payments) {
  console.log(describe(p));
}

console.log("--- 4. Utility types");
const product: Product = { id: 1, name: "Pen", price: 5000, stock: 10 };
const summary: ProductSummary = { id: product.id, name: product.name };
const update: ProductUpdate = { price: 6000, stock: 8 };
const frozen: ReadonlyProduct = product;
console.log("summary :", summary);
console.log("updated :", applyUpdate(product, update));
console.log("readonly:", frozen);

console.log("--- 5. Generics");
const words = ["apple", "avocado", "banana", "blueberry", "cherry"];
console.log(groupBy(words, (w) => w.length));
console.log(groupBy(words, (w) => w.charAt(0)));

console.log("--- 6. Async");
interface User {
  id: number;
  name: string;
}
// A data: URL is answered by fetch itself, so this part needs no network.
const okUrl = `data:application/json,${encodeURIComponent('{"id":1,"name":"Alice"}')}`;
const wrongShapeUrl = `data:application/json,${encodeURIComponent('{"unexpected":true}')}`;

const user = await fetchJson<User>(okUrl);
console.log("ok body        :", user.name);

// T is a promise to the compiler only: this body has no `name`, yet the type says string.
const wrong = await fetchJson<User>(wrongShapeUrl);
console.log("wrong-shape body, user.name =", wrong.name, "(compiler believes: string)");

// res.ok === false path (needs network): the Error is caught as in module section 12.
try {
  await fetchJson<User>("https://jsonplaceholder.typicode.com/users/9999");
} catch (err) {
  if (err instanceof Error) {
    console.error("Gagal:", err.message);
  } else {
    console.error("Error tidak dikenal:", err);
  }
}

console.log("--- 7. Refactor (strict TypeScript)");
await import("./07-refactor/fruits.js");
console.log("dom.ts is type-checked only (Node has no `document`).");
