// Exercise 3: the `never` exhaustiveness check (module section 9.3).
// A fourth variant is added to PaymentMethod but describe() is not updated.
import type { PaymentMethod } from "../../src/03-discriminated-union.js";

type WithCrypto = PaymentMethod | { kind: "crypto"; coin: string };

export function describeOld(p: WithCrypto): string {
  switch (p.kind) {
    case "card":
      return "card";
    case "transfer":
      return "transfer";
    case "cash":
      return "cash";
    default: {
      const _exhaustive: never = p; // the compiler points here
      return _exhaustive;
    }
  }
}
