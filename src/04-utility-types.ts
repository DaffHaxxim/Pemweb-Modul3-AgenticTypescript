// Exercise 4 - Utility types derived from one source of truth.
export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

// Only id and name.
export type ProductSummary = Pick<Product, "id" | "name">;

// Every field optional, but `id` is removed first so it can never be changed.
export type ProductUpdate = Partial<Omit<Product, "id">>;

// Every field readonly.
export type ReadonlyProduct = Readonly<Product>;

// Small helper that uses the types the way a caller would.
export function applyUpdate(product: Product, update: ProductUpdate): Product {
  return { ...product, ...update };
}
