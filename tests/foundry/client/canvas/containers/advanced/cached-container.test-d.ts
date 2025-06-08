import { assertType, expectTypeOf } from "vitest";
import { CachedContainer } from "#client/canvas/containers/_module.mjs";

const mySprite = new PIXI.Sprite();

const container = new CachedContainer(mySprite);
assertType<PIXI.Container>(container);
expectTypeOf(container.renderTexture).toEqualTypeOf<PIXI.RenderTexture>();
expectTypeOf(container.clearColor).toEqualTypeOf<[number, number, number, number]>();
expectTypeOf(container.displayed).toEqualTypeOf<boolean>();
expectTypeOf(container.destroy()).toEqualTypeOf<void>();
expectTypeOf(
  container.destroy({
    children: false,
    texture: false,
    baseTexture: false,
  }),
).toEqualTypeOf<void>();
expectTypeOf(container.render(new PIXI.Renderer())).toEqualTypeOf<void>();
expectTypeOf(container.alphaMode).toEqualTypeOf<undefined>();
