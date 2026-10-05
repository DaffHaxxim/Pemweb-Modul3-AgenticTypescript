// Exercises 1, 2 and 5: wrong uses of the functions are rejected.
import { average } from "../../src/01-basic-types.js";
import { formatId } from "../../src/02-union-narrowing.js";
import { groupBy } from "../../src/05-generics.js";

const mean: number = average([1, 2, 3]); // average can return null
formatId(true); // only string | number
groupBy([1, 2, 3], (n) => n > 1); // the key must be string | number, not boolean

console.log(mean);
