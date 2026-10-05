// Exercise 7 (part 1) - Modul 2 section 2.1 (Arrays) and 2.2 (Objects) in strict TypeScript.
// Original: notes/07-original/fruits.original.ts. It compiled with zero errors under `strict`,
// so the refactor only makes the implicit types explicit. See notes/07-refactor-errors.md.

// 2.1 Arrays
const fruits: string[] = ["🍏", "🍉", "🍊"];

fruits.push("🍇");
fruits.pop();

fruits.unshift("🍊");
fruits.shift();

const moreFruits: string[] = ["🍏", "🍉"];
const allFruits: string[] = fruits.concat(moreFruits);

const index: number = fruits.indexOf("🍏");
const hasApple: boolean = fruits.includes("🍏");

const someFruits: string[] = fruits.slice(1, 3);

fruits.splice(2, 0, "🍏");
fruits.splice(1, 1);

fruits.forEach((fruit) => {
  console.log(fruit);
});

console.log(allFruits, index, hasApple, someFruits);

// 2.2 Objects
interface Person {
  name: string;
  age: number;
  greet: () => string;
}

interface Work {
  name: string;
  position: string;
  greet: () => string;
}

const person: Person = {
  name: "Alice",
  age: 25,
  greet: function () {
    return `Hello, ${this.name}`;
  },
};
const work: Work = {
  name: "Lorem Ipsum",
  position: "Software Engineer",
  greet: () => {
    return `Hello, ${work.name}`;
  },
};

console.log(person.name);
console.log(person["age"]);
console.log(work.name);
console.log(work["position"]);
console.log(work.greet());
