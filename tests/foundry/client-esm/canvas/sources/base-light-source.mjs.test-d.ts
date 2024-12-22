import { expectTypeOf } from "vitest";
import type BaseLightSource from "../../../../../src/foundry/client-esm/canvas/sources/base-light-source.d.mts";

declare const mySource: BaseLightSource;

expectTypeOf(mySource.active).toEqualTypeOf<boolean>();
expectTypeOf(mySource.drawMeshes().background?.visible).toEqualTypeOf<boolean | undefined>();
expectTypeOf(mySource.animateTorch(5)).toEqualTypeOf<void>();
