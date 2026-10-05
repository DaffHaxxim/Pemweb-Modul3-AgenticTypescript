// Exercise 4: what the derived types forbid.
import type { Product, ProductSummary, ProductUpdate, ReadonlyProduct } from "../../src/04-utility-types.js";

const product: Product = { id: 1, name: "Pen", price: 5000, stock: 10 };

const summary: ProductSummary = { id: 1, name: "Pen", price: 5000 }; // ProductSummary has only id and name
const update: ProductUpdate = { id: 2 }; // id is not allowed in an update
const frozen: ReadonlyProduct = product;
frozen.price = 1; // every field is readonly

console.log(summary, update, frozen);
