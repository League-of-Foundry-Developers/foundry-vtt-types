import { expectTypeOf } from "vitest";

expectTypeOf(AbstractBaseMaskFilter.vertexShader).toEqualTypeOf<string>();

let myABMF;
expectTypeOf((myABMF = AbstractBaseMaskFilter.create())).toEqualTypeOf<AbstractBaseMaskFilter>();

declare const someFilterSystem: PIXI.FilterSystem;
declare const someRT1: PIXI.RenderTexture;
declare const someRT2: PIXI.RenderTexture;

expectTypeOf(myABMF.apply(someFilterSystem, someRT1, someRT2, PIXI.CLEAR_MODES.BLIT)).toEqualTypeOf<void>();
