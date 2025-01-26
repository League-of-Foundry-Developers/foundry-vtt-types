import { expectTypeOf } from "vitest";

declare const someSprite: PIXI.Sprite;
declare const someTex: PIXI.Texture;
let myTTF;

expectTypeOf(TextureTransitionFilter.TYPES.CROSSHATCH).toMatchTypeOf<TextureTransitionFilter.TYPES>();
expectTypeOf(
  TextureTransitionFilter.animate(someSprite, someTex, {
    duration: 400,
    name: "bob",
    easing: "easeInCircle",
    type: TextureTransitionFilter.TYPES.HOLE,
  }),
).toEqualTypeOf<Promise<boolean>>();
expectTypeOf(TextureTransitionFilter.fragmentShader).toEqualTypeOf<string>();

expectTypeOf((myTTF = TextureTransitionFilter.create())).toEqualTypeOf<TextureTransitionFilter>();
expectTypeOf(myTTF.type).toEqualTypeOf<TextureTransitionFilter.TYPES>();
