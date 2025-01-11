import { expectTypeOf } from "vitest";
import type DynamicRingData from "../../../../../src/foundry/client-esm/canvas/tokens/ring-data.d.mts";
import type TokenRing from "../../../../../src/foundry/client-esm/canvas/tokens/ring.d.mts";

declare const mySource: DynamicRingData;

expectTypeOf(mySource.id).toEqualTypeOf<string | undefined>();
expectTypeOf(mySource.label).toEqualTypeOf<string | undefined>();
expectTypeOf(mySource.spritesheet).toEqualTypeOf<string | null>();
expectTypeOf(mySource.effects).toEqualTypeOf<Record<string, string>>();
expectTypeOf(mySource.framework.ringClass).toEqualTypeOf<typeof TokenRing>();
expectTypeOf(mySource.framework.shaderClass).toEqualTypeOf<typeof PrimaryBaseSamplerShader>();
