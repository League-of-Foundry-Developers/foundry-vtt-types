import { expectTypeOf } from "vitest";

import AbstractBaseMaskFilter = foundry.canvas.rendering.filters.AbstractBaseMaskFilter;

expectTypeOf(AbstractBaseMaskFilter.vertexShader).toEqualTypeOf<string>();

const myABMF = AbstractBaseMaskFilter.create();
expectTypeOf(myABMF).toEqualTypeOf<AbstractBaseMaskFilter>();

declare const someFilterSystem: PIXI.FilterSystem;
declare const someRT1: PIXI.RenderTexture;
declare const someRT2: PIXI.RenderTexture;

expectTypeOf(myABMF.apply(someFilterSystem, someRT1, someRT2, PIXI.CLEAR_MODES.BLIT)).toEqualTypeOf<void>();
