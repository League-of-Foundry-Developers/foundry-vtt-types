import { expectTypeOf } from "vitest";
import type { HandleEmptyObject } from "fvtt-types/utils";

interface MyLayerOptions extends CanvasLayer.LayerOptions {
  name: "MyLayer";
  baseClass: typeof MyCanvasLayer;
}

declare class MyCanvasLayer extends CanvasLayer {
  override options: MyLayerOptions;

  static override get layerOptions(): MyLayerOptions;

  protected override _draw(_options: HandleEmptyObject<CanvasLayer.DrawOptions>): Promise<void>;
}

expectTypeOf(MyCanvasLayer.instance).toEqualTypeOf<CanvasLayer.Any | PIXI.Container | undefined>;

const layer = new MyCanvasLayer();

expectTypeOf(layer.name).toEqualTypeOf<string>();
expectTypeOf(layer.hookName).toEqualTypeOf<string>();
expectTypeOf(layer.options.baseClass).toExtend<CanvasLayer.AnyConstructor>();
expectTypeOf(layer.options.baseClass).toEqualTypeOf<typeof MyCanvasLayer>();
expectTypeOf(layer.draw()).toEqualTypeOf<Promise<MyCanvasLayer>>();
expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer.tearDown()).toEqualTypeOf<Promise<MyCanvasLayer>>();
