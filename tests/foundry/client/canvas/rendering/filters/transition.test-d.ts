import { expectTypeOf, test } from "vitest";

import TextureTransitionFilter = foundry.canvas.rendering.filters.TextureTransitionFilter;

declare const someSprite: PIXI.Sprite;
declare const someTex: PIXI.Texture;

test("foundry/client/canvas/rendering/filters/transition", () => {
  const myTTF = TextureTransitionFilter.create();
  expectTypeOf(myTTF).toEqualTypeOf<TextureTransitionFilter>();

  expectTypeOf(TextureTransitionFilter.TYPES.CROSSHATCH).toExtend<TextureTransitionFilter.TYPES>();
  expectTypeOf(
    TextureTransitionFilter.animate(someSprite, someTex, {
      duration: 400,
      name: "bob",
      easing: "easeInCircle",
      type: TextureTransitionFilter.TYPES.HOLE,
    }),
  ).toEqualTypeOf<Promise<boolean>>();

  expectTypeOf(myTTF.type).toEqualTypeOf<TextureTransitionFilter.TYPES>();
});
