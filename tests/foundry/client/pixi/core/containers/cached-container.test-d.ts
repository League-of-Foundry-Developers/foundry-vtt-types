import { assertType, expectTypeOf } from "vitest";

const container = new CachedContainer();
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
