import { expectTypeOf, test } from "vitest";

import AbstractBaseMaskFilter = foundry.canvas.rendering.filters.AbstractBaseMaskFilter;

declare const someFilterSystem: PIXI.FilterSystem;
declare const someRT1: PIXI.RenderTexture;
declare const someRT2: PIXI.RenderTexture;

test("foundry/client/canvas/rendering/filters/base-mask-filter", () => {
  const myABMF = AbstractBaseMaskFilter.create();
  expectTypeOf(myABMF).toEqualTypeOf<AbstractBaseMaskFilter>();

  expectTypeOf(myABMF.apply(someFilterSystem, someRT1, someRT2, PIXI.CLEAR_MODES.BLIT)).toEqualTypeOf<void>();
});
