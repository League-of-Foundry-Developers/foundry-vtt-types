import { expectTypeOf, test } from "vitest";
import type { BasisBinding } from "@pixi/basis";

declare const wasmBinary: ArrayBuffer;

test("foundry/public/scripts/ktx2/basis_transcoder", () => {
  expectTypeOf(BASIS()).toEqualTypeOf<Promise<BasisBinding>>();

  expectTypeOf(BASIS({ wasmBinary })).toEqualTypeOf<Promise<BasisBinding>>();
});
