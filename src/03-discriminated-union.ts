// Exercise 3 - Discriminated union with an exhaustiveness check.
// The shared literal property `kind` is the discriminant: checking it narrows
// the whole object to one variant.
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
      // If a new variant is added to PaymentMethod and not handled above,
      // `p` is no longer `never` here and this assignment fails to compile.
      const _exhaustive: never = p;
      return _exhaustive;
    }
  }
}
