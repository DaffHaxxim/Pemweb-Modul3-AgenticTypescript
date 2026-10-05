# Panduan Demo: Latihan TypeScript (Modul 3, Bagian 16)

Panduan singkat untuk presentasi dan demo. Perkiraan durasi: **20 menit**. Untuk penjelasan yang sangat rinci, lihat `GUIDE-Latihan-Typescript.md` (bahasa Inggris).

## 1. Gambaran Singkat

Proyek ini berisi jawaban dari 7 soal Latihan TypeScript. Satu soal = satu file di folder `src/`. Satu perintah (`npm start`) menjalankan semuanya, dan satu perintah lain (`npm run typecheck`) membuktikan bahwa semua tipenya benar.

| No | Soal | Konsep | File |
|----|------|--------|------|
| 1 | `average` yang aman untuk array kosong | Tipe dasar, `null` | `src/01-basic-types.ts` |
| 2 | `formatId` untuk `string` atau `number` | Union dan narrowing | `src/02-union-narrowing.ts` |
| 3 | `PaymentMethod` dan `describe` | Discriminated union, `never` | `src/03-discriminated-union.ts` |
| 4 | `ProductSummary`, `ProductUpdate`, `ReadonlyProduct` | Utility types | `src/04-utility-types.ts` |
| 5 | `groupBy` | Generics | `src/05-generics.ts` |
| 6 | `fetchJson<T>` | Async dan error handling | `src/06-async.ts` |
| 7 | JavaScript Modul 2 menjadi TypeScript `strict` | Refactor, membaca error | `src/07-refactor/` |

Pesan utama yang ingin disampaikan: **TypeScript menangkap kesalahan sebelum program dijalankan**, asalkan mode `strict` menyala.

## 2. Persiapan Sebelum Demo (5 menit sebelum mulai)

Buka terminal di folder proyek, lalu jalankan:

```bash
cd "/home/sulthdaff/Documents/ITSCollege Program/PemrogramanWeb/Praktikum-3/Latihan-Typescript"
npm install
npm run typecheck
npm run build
```

Hasil yang benar:
- `npm run typecheck` selesai **tanpa pesan error** (hanya dua baris `>` dari npm).
- `npm run build` membuat folder `dist/`.

Siapkan juga: editor dengan file `src/` terbuka, dan koneksi internet (hanya dipakai satu baris di latihan 6, lihat bagian 3.6).

Jika `node` tidak ditemukan di terminal baru: `source ~/.nvm/nvm.sh`.

## 3. Alur Presentasi

| Menit | Bagian | Yang dilakukan |
|-------|--------|----------------|
| 0-2 | Pembuka | Jelaskan tujuan, tampilkan tabel di atas |
| 2-4 | Setup | Tunjukkan `package.json` dan `tsconfig.json` |
| 4-16 | Latihan 1 sampai 7 | Kode, demo, poin penjelasan |
| 16-18 | Jalankan semua | `npm start` |
| 18-20 | Penutup dan tanya jawab | Ringkasan konsep (bagian 4) |

### 3.0 Setup (2 menit)

Tunjukkan dua file ini.

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

`package.json` (bagian scripts):

```json
"scripts": {
  "build": "tsc",
  "typecheck": "tsc --noEmit",
  "start": "node dist/index.js",
  "dev": "tsx src/index.ts"
}
```

Poin penjelasan:
- **`"strict": true` adalah opsi terpenting.** Tanpanya, banyak demo di bawah tidak akan menunjukkan error.
- `typecheck` hanya memeriksa tipe, tidak menghasilkan file. Ini "penguji otomatis" kita.
- `build` mengubah `.ts` menjadi `.js` di folder `dist/`. `start` menjalankan hasilnya.
- `dev` (memakai `tsx`) menjalankan `.ts` langsung, **tetapi tidak memeriksa tipe**.

### 3.1 Latihan 1: Tipe Dasar, `average`

**Soal:** buat `average(nums: number[])` yang benar untuk array kosong.

```ts
export function average(nums: number[]): number | null {
  if (nums.length === 0) return null;
  let sum = 0;
  for (const n of nums) sum += n;
  return sum / nums.length;
}
```

Hasil di `npm start`:

```text
average([1, 2, 3, 4]) = 2.5
average([])           = null
```

Poin penjelasan:
- Rata-rata dari array kosong **tidak ada**. Mengembalikan `0` berarti berbohong, dan `NaN` (hasil `0 / 0`) tetap bertipe `number` sehingga lolos tanpa disadari.
- Tipe `number | null` memaksa pemanggil menangani kasus kosong.

**Demo langsung (30 detik):** di `src/index.ts`, tambahkan baris ini sebelum `console.log("--- 1. Basic types");`, lalu jalankan `npm run typecheck`:

```ts
const m: number = average([1, 2, 3]);
```

Error yang muncul:

```text
error TS2322: Type 'number | null' is not assignable to type 'number'.
```

Hapus baris itu setelah demo (Ctrl+Z).

### 3.2 Latihan 2: Union dan Narrowing, `formatId`

**Soal:** string menjadi huruf besar, angka menjadi 6 digit (`000482`).

```ts
export function formatId(id: string | number): string {
  if (typeof id === "string") {
    return id.toUpperCase();
  }
  return String(id).padStart(6, "0");
}
```

Hasil:

```text
formatId("ab-12") = AB-12
formatId(482)     = 000482
```

Poin penjelasan:
- `string | number` artinya "salah satu dari dua tipe".
- Setelah `typeof id === "string"`, TypeScript **mempersempit (narrowing)** tipe: di dalam `if`, `id` adalah `string`; sesudahnya, `id` pasti `number`.
- `padStart(6, "0")` menambah angka `0` di kiri sampai panjangnya 6. Metode ini adalah JavaScript biasa, bukan fitur TypeScript.
- Di luar soal: angka negatif atau lebih dari 6 digit tidak ditangani khusus (`-5` menjadi `0000-5`, `1234567` tetap `1234567`).

### 3.3 Latihan 3: Discriminated Union dan `never`

**Soal:** `PaymentMethod` dengan tiga jenis (`card`, `transfer`, `cash`) dan `describe` yang dicek kelengkapannya.

```ts
export type PaymentMethod =
  | { kind: "card"; brand: string; last4: string }
  | { kind: "transfer"; bank: string; accountNo: string }
  | { kind: "cash"; amount: number };

export function describe(p: PaymentMethod): string {
  switch (p.kind) {
    case "card":
      return `Card ${p.brand} ending in ${p.last4}`;
    case "transfer":
      return `Bank transfer via ${p.bank} (account ${p.accountNo})`;
    case "cash":
      return `Cash payment of ${p.amount}`;
    default: {
      const _exhaustive: never = p;
      return _exhaustive;
    }
  }
}
```

Hasil:

```text
Card Visa ending in 4242
Bank transfer via BCA (account 1234567890)
Cash payment of 50000
```

Poin penjelasan:
- Properti `kind` adalah "penanda jenis". Setelah dicek di `switch`, TypeScript tahu persis properti apa yang tersedia (`brand` hanya ada di `card`).
- Di `default`, semua jenis sudah ditangani, sehingga `p` bertipe `never` (tipe yang tidak punya nilai).
- Gunanya: kalau suatu hari ada jenis baru dan `switch` lupa diperbarui, kode **tidak bisa dikompilasi**.

**Demo langsung (1 menit):** di `src/03-discriminated-union.ts`, ubah baris terakhir type menjadi dua baris:

```ts
  | { kind: "cash"; amount: number }
  | { kind: "crypto"; coin: string };
```

Jalankan `npm run typecheck`. Error yang muncul:

```text
error TS2322: Type '{ kind: "crypto"; coin: string; }' is not assignable to type 'never'.
```

Pesan error langsung menyebut jenis yang belum ditangani (`crypto`). Kembalikan file dengan Ctrl+Z.

### 3.4 Latihan 4: Utility Types

**Soal:** dari `Product`, buat `ProductSummary`, `ProductUpdate` (tanpa `id`), dan `ReadonlyProduct`.

```ts
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export type ProductSummary = Pick<Product, "id" | "name">;
export type ProductUpdate = Partial<Omit<Product, "id">>;
export type ReadonlyProduct = Readonly<Product>;
```

Hasil:

```text
summary : { id: 1, name: 'Pen' }
updated : { id: 1, name: 'Pen', price: 6000, stock: 8 }
readonly: { id: 1, name: 'Pen', price: 5000, stock: 10 }
```

Poin penjelasan:
- Semua tipe diturunkan dari satu sumber (`Product`). Kalau `Product` berubah, turunannya ikut berubah.
- `Pick`: ambil beberapa properti. `Omit`: buang properti. `Partial`: semua jadi opsional. `Readonly`: semua tidak bisa diubah.
- `Omit` dijalankan lebih dulu, jadi `id` benar-benar hilang dari `ProductUpdate`, bukan sekadar opsional.
- Tipe hanya ada saat kompilasi. `Readonly` tidak membekukan objek saat program berjalan.

**Demo langsung (30 detik):** di `src/index.ts`, ubah baris `const update` menjadi:

```ts
const update: ProductUpdate = { id: 2, price: 6000 };
```

Error yang muncul:

```text
error TS2353: Object literal may only specify known properties, and 'id' does not exist in type 'Partial<Omit<Product, "id">>'.
```

Kembalikan dengan Ctrl+Z.

### 3.5 Latihan 5: Generics, `groupBy`

**Soal:** `groupBy<T, K extends string | number>(items, key): Record<K, T[]>`.

```ts
export function groupBy<T, K extends string | number>(
  items: T[],
  key: (item: T) => K,
): Record<K, T[]> {
  const result: Partial<Record<K, T[]>> = {};
  for (const item of items) {
    const k = key(item);
    const bucket = result[k];
    if (bucket) {
      bucket.push(item);
    } else {
      result[k] = [item];
    }
  }
  return result as Record<K, T[]>;
}
```

Hasil untuk `["apple", "avocado", "banana", "blueberry", "cherry"]`:

```text
{ '5': [ 'apple' ], '6': [ 'banana', 'cherry' ], '7': [ 'avocado' ], '9': [ 'blueberry' ] }   (dikelompokkan per panjang)
{ a: [ 'apple', 'avocado' ], b: [ 'banana', 'blueberry' ], c: [ 'cherry' ] }                   (dikelompokkan per huruf pertama)
```

(Tampilan asli di terminal dibagi menjadi beberapa baris, isinya sama.)

Poin penjelasan:
- `T` adalah tipe elemen, `K` adalah tipe kunci hasil. TypeScript menebak keduanya dari pemanggilan, jadi tidak perlu ditulis.
- `K extends string | number` adalah batasan: hanya `string` atau `number` yang boleh jadi kunci objek. Memberi fungsi yang mengembalikan `boolean` akan error.
- Hasil sementara bertipe `Partial` karena awalnya kosong. Satu-satunya `as` di proyek ada di baris `return`, dengan komentar alasannya.
- Urutan kunci `5, 6, 7, 9` bukan urutan masuk (`5, 7, 6, 9`). Itu perilaku JavaScript: kunci berupa angka diurutkan naik.

Jika ditanya soal batasan: kunci seperti `"toString"` atau `"__proto__"` membuat fungsi ini error, karena objek biasa mewarisi properti itu. Untuk soal latihan ini tidak masalah.

### 3.6 Latihan 6: Async, `fetchJson`

**Soal:** `fetchJson<T>(url): Promise<T>` yang melempar `Error` jika `res.ok` bernilai `false`. Diskusikan: apa yang **tidak** dijamin oleh `T`?

```ts
export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request to ${url} failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}
```

Hasil di `npm start` (tiga percobaan):

```text
ok body        : Alice
wrong-shape body, user.name = undefined (compiler believes: string)
Gagal: Request to https://jsonplaceholder.typicode.com/users/9999 failed: 404 Not Found
```

Poin penjelasan:
- `fetch` **tidak** error untuk status 404 atau 500. Ia hanya error kalau jaringan gagal. Karena itu `res.ok` harus dicek sendiri.
- Percobaan 1 dan 2 memakai alamat `data:` sehingga **tidak butuh internet**. Percobaan 3 membutuhkan internet dan memanggil situs publik untuk mendapat 404 sungguhan.
- **Jawaban diskusi:** `T` tidak menjamin apa pun tentang isi data. `as T` hanya memberi tahu compiler "percayalah". Percobaan 2 membuktikannya: isi respons `{"unexpected":true}` tidak punya `name`, tetapi compiler mengira `name` adalah `string`.
- Solusi (dari modul): perlakukan data luar sebagai `unknown` lalu periksa, atau validasi bentuknya saat program berjalan.

Jika tidak ada internet: baris ketiga akan berisi pesan error jaringan, bukan 404. Program tetap selesai karena ada `try/catch`.

### 3.7 Latihan 7: Refactor ke TypeScript `strict`

**Soal:** ambil kode JavaScript dari bagian "Intermediate JavaScript" di Modul 2, ubah ke TypeScript `strict`, dan catat error yang muncul.

Kode asli disalin apa adanya ke `notes/07-original/`. Jalankan:

```bash
npx tsc -p notes
```

Hasil (ringkas):
- `fruits.original.ts` (array dan objek): **0 error**.
- `dom.original.ts` (manipulasi DOM): **15 error**.
- Tambahan 7 error dari `notes/compile-errors/` adalah error yang disengaja untuk latihan 1 sampai 5. Jadi total yang tampil: 22 baris error.

Poin penjelasan, ringkasan 15 error dari kode DOM:

| Error | Jumlah | Penyebab | Perbaikan |
|-------|--------|----------|-----------|
| `possibly 'null'` (TS18047, TS2531) | 10 | `getElementById` bisa mengembalikan `null` | `if (el) { ... }` |
| `Property 'value' does not exist` (TS2339) | 1 | `HTMLElement` tidak punya `value` | `instanceof HTMLInputElement` |
| `implicitly has an 'any' type` (TS7006) | 1 | parameter `id` tanpa tipe | `id: HTMLElement` |
| `Cannot find name 'button'` (TS2304) | 1 | variabel tidak pernah dideklarasikan | ambil dengan `getElementById` lalu cek |
| `HTMLElement \| null` tidak cocok (TS2345) | 1 | `removeChild` tidak menerima `null` | cek keduanya sebelum dipanggil |
| `possibly 'undefined'` (TS2532) | 1 | `divs[i]` bisa `undefined` (`noUncheckedIndexedAccess`) | simpan ke variabel lalu cek |

Pesan penting: **semua diperbaiki dengan memperbaiki penyebabnya**, bukan dengan `any`, `!`, atau `@ts-ignore` (sesuai anjuran modul).

File hasil perbaikan: `src/07-refactor/fruits.ts` (bisa dijalankan) dan `src/07-refactor/dom.ts` (hanya diperiksa tipenya, karena Node tidak punya `document`).

### 3.8 Jalankan Semuanya (2 menit)

```bash
npm run typecheck
npm start
```

- `npm run typecheck`: tidak ada error. Ini bukti semua soal yang berupa tipe terpenuhi.
- `npm start`: mencetak hasil ketujuh latihan, seperti yang sudah ditunjukkan di atas.

Opsional, bila ada waktu: `npm run dev` menjalankan hal yang sama lewat `tsx` tanpa build, dan `bun src/index.ts` lewat Bun. Hasilnya sama; bedanya hanya format `console.log` pada Bun. Keduanya **tidak** memeriksa tipe.

## 4. Ringkasan Konsep untuk Penutup

| Konsep | Latihan | Satu kalimat |
|--------|---------|--------------|
| `strict` | semua | Menyalakan pemeriksaan ketat, termasuk `null` dan `any` tersembunyi |
| `null` sebagai tipe | 1 | Kasus kosong menjadi bagian dari tipe, bukan kejutan saat runtime |
| Narrowing | 2 | Setelah dicek, tipe menjadi lebih spesifik |
| Discriminated union dan `never` | 3 | Compiler memastikan semua kemungkinan ditangani |
| Utility types | 4 | Tipe baru diturunkan dari tipe lama |
| Generics | 5 | Satu fungsi untuk banyak tipe, tetap aman |
| `as` dan async | 6 | Tipe bukan pemeriksaan runtime; data luar harus divalidasi |
| Membaca error | 7 | Perbaiki penyebabnya, jangan dibungkam |

## 5. Pertanyaan yang Mungkin Muncul

**Kenapa `import` memakai `.js` padahal filenya `.ts`?**
Karena proyek memakai `"module": "NodeNext"` dan `"type": "module"`. Node membaca file `.js` hasil kompilasi, jadi alamat impor harus menunjuk ke file itu. TypeScript tahu bahwa `./x.js` berasal dari `x.ts`.

**Apa bedanya `npm run typecheck`, `npm run dev`, dan `npm start`?**
`typecheck` hanya memeriksa tipe. `dev` menjalankan `.ts` langsung tanpa memeriksa tipe. `start` menjalankan hasil `build` (folder `dist/`), jadi harus `npm run build` dulu.

**Kenapa kode berjalan di `npm run dev` padahal ada error tipe?**
`tsx` (dan Bun) hanya membuang tipe, tidak memeriksanya. Selalu jalankan `npm run typecheck`.

**Kenapa ada `as` di `groupBy` dan `fetchJson`?**
Modul menyarankan `as` hanya dengan alasan yang jelas. Di `groupBy`, compiler tidak bisa membuktikan semua kunci terisi. Di `fetchJson`, kita memang percaya bentuk datanya (dan itulah yang dibahas di diskusi latihan 6). Keduanya punya komentar alasan di kode.

**Kenapa `dom.ts` tidak dijalankan?**
Kode itu memakai `document` yang hanya ada di browser. Di sini ia cukup diperiksa tipenya.

**Kenapa `npx tsc -p notes` menampilkan error? Apakah ada yang rusak?**
Tidak. Folder `notes/` memang berisi kode asli yang gagal dan contoh salah yang disengaja, sebagai bukti. Proyek utama dicek dengan `npm run typecheck`.

**Versi TypeScript yang dipakai?**
7.0.2 (hasil `npm install typescript`). Pada versi ini, `npx tsc src/index.ts` ditolak bila ada `tsconfig.json` di folder yang sama, berbeda dengan contoh di modul.

## 6. Jika Terjadi Masalah Saat Demo

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| `npm start` error `Cannot find module .../dist/index.js` | Belum di-build | `npm run build` dulu, atau pakai `npm run dev` |
| `command not found: npm` atau `node` | nvm belum dimuat | `source ~/.nvm/nvm.sh` |
| Baris ketiga latihan 6 berisi error jaringan | Tidak ada internet | Normal, jelaskan bahwa percobaan 1 dan 2 tetap membuktikan poinnya |
| `npm run typecheck` error setelah demo langsung | Perubahan belum dikembalikan | Ctrl+Z di editor, atau ulangi isi file dari bagian 3 |
| `tsc` tidak ditemukan | `npm install` belum dijalankan | `npm install` |

## 7. Daftar File Penting

```text
src/01-basic-types.ts ... src/06-async.ts   jawaban latihan 1 sampai 6
src/07-refactor/                            jawaban latihan 7 (fruits.ts, dom.ts)
src/index.ts                                menjalankan dan mencetak semua latihan
notes/06-async-discussion.md                jawaban diskusi latihan 6 (Inggris)
notes/07-refactor-errors.md                 catatan error latihan 7 (Inggris)
notes/compile-errors/                       contoh kode salah yang disengaja
README.md                                   cara menjalankan dan daftar persyaratan
GUIDE-Latihan-Typescript.md                 panduan lengkap dan rinci (Inggris)
```
