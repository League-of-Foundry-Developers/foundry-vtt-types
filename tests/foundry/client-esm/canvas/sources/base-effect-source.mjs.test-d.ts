import { expectTypeOf } from "vitest";
import type BaseEffectSource from "../../../../../src/foundry/client-esm/canvas/sources/base-effect-source.d.mts";

declare const mySource: BaseEffectSource<BaseEffectSource.BaseEffectSourceData, PIXI.Polygon>;

expectTypeOf(mySource.active).toEqualTypeOf<boolean>();
