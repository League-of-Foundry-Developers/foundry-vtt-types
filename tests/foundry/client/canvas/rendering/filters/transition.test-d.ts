import { expectTypeOf } from "vitest";
import { TextureTransitionFilter } from "#client/canvas/rendering/filters/_module.mjs";

declare const someSprite: PIXI.Sprite;
declare const someTex: PIXI.Texture;

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
expectTypeOf(TextureTransitionFilter.fragmentShader).toEqualTypeOf<string>();

expectTypeOf(myTTF.type).toEqualTypeOf<TextureTransitionFilter.TYPES>();
