import { expectTypeOf } from "vitest";
import { AbstractBaseMaskFilter } from "#client/canvas/rendering/filters/_module.mjs";

expectTypeOf(AbstractBaseMaskFilter.vertexShader).toEqualTypeOf<string>();

const myABMF = AbstractBaseMaskFilter.create();
expectTypeOf(myABMF).toEqualTypeOf<AbstractBaseMaskFilter>();

declare const someFilterSystem: PIXI.FilterSystem;
declare const someRT1: PIXI.RenderTexture;
declare const someRT2: PIXI.RenderTexture;

expectTypeOf(myABMF.apply(someFilterSystem, someRT1, someRT2, PIXI.CLEAR_MODES.BLIT)).toEqualTypeOf<void>();
