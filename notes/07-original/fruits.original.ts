// VERBATIM copy of the JavaScript in Modul 2, section 2.1 (Arrays) and 2.2 (Objects),
// only renamed to .ts. Deliberately NOT under src/ so it is not part of the build.
// Checked with: npx tsc -p notes (notes/tsconfig.json extends the project's strict config)

let fruits = ["🍏", "🍉", "🍊"]; // menyimpan beberapa nilai (buah) dalam satu variabel

fruits.push("🍇"); // Menambah elemen di akhir array
fruits.pop(); // Menghapus elemen terakhir

fruits.unshift("🍊"); // Menambah elemen di awal array
fruits.shift(); // Menghapus elemen pertama

const moreFruits = ["🍏", "🍉"];
const allFruits = fruits.concat(moreFruits);

const index = fruits.indexOf("🍏"); // Mengembalikan index dari '🍏', atau -1 jika tidak ditemukan
const hasApple = fruits.includes("🍏"); // Mengecek apakah array memiliki '🍏', hasilnya true/false

const someFruits = fruits.slice(1, 3); // Mengambil elemen dari index 1 hingga sebelum 3

fruits.splice(2, 0, "🍏"); // Menambah 🍏 di index 2 tanpa menghapus elemen
fruits.splice(1, 1); // Menghapus 1 elemen mulai dari index 1

fruits.forEach((fruit) => {
  console.log(fruit);
});

let person = {
  name: "Alice",
  age: 25,
  greet: function () {
    return `Hello, ${this.name}`;
  },
};
let work = {
  name: "Lorem Ipsum",
  position: "Software Engineer",
  greet: () => {
    return `Hello, ${work.name}`;
  },
};

console.log(person.name); // Mengakses dengan titik
console.log(person["age"]); // Mengakses dengan bracket
console.log(work.name); // Mengakses dengan titik
console.log(work["position"]); // Mengakses dengan bracket
console.log(work.greet()); // Memanggil method greet()
