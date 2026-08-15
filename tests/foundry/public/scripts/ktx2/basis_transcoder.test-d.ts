import { expectTypeOf } from "vitest";
import type { BasisBinding } from "@pixi/basis";

expectTypeOf(BASIS()).toEqualTypeOf<Promise<BasisBinding>>();

declare const wasmBinary: ArrayBuffer;

expectTypeOf(BASIS({ wasmBinary })).toEqualTypeOf<Promise<BasisBinding>>();
