import { expectTypeOf } from "vitest";
// eslint-disable-next-line import-x/no-named-default
import { default as AlphaBlurFilter, AlphaBlurFilterPass } from "#client/canvas/rendering/filters/blur.mjs";

// AlphaBlurFilterPass tests
expectTypeOf(AlphaBlurFilterPass.vertTemplate(2, false)).toEqualTypeOf<string>();

const myABFilterPass = new AlphaBlurFilterPass(true, 4, 2, 500, 3);

expectTypeOf(myABFilterPass.blur).toEqualTypeOf<number>();

// AlphaBlurFilter tests
const myABFilter = new AlphaBlurFilter(4, 2, 500, 2);
declare const someRT: PIXI.RenderTexture;
declare const someFilterSystem: PIXI.FilterSystem;
expectTypeOf(myABFilter.apply(someFilterSystem, someRT, someRT, PIXI.CLEAR_MODES.AUTO)).toEqualTypeOf<void>();
expectTypeOf(myABFilter.blendMode).toEqualTypeOf<PIXI.BLEND_MODES>();
