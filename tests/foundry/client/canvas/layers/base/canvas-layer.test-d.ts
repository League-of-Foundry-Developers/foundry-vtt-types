import { expectTypeOf } from "vitest";
import type { HandleEmptyObject } from "#utils";
import { CanvasLayer } from "#client/canvas/layers/_module.mjs";
import EffectsCanvasGroup = foundry.canvas.groups.EffectsCanvasGroup;

interface MyLayerOptions extends CanvasLayer.LayerOptions {
  name: "MyLayer";
  baseClass: typeof MyCanvasLayer;
}

declare class MyCanvasLayer extends CanvasLayer {
  override options: MyLayerOptions;

  static override get layerOptions(): MyLayerOptions;

  protected override _draw(_options: HandleEmptyObject<CanvasLayer.DrawOptions>): Promise<void>;
}

expectTypeOf(MyCanvasLayer.instance).toEqualTypeOf<CanvasLayer.Any | EffectsCanvasGroup.Implementation | undefined>;

const layer = new MyCanvasLayer();

expectTypeOf(layer.name).toEqualTypeOf<string>();
expectTypeOf(layer.hookName).toEqualTypeOf<string>();
expectTypeOf(layer.options.baseClass).toExtend<CanvasLayer.AnyConstructor>();
expectTypeOf(layer.options.baseClass).toEqualTypeOf<typeof MyCanvasLayer>();
expectTypeOf(layer.draw()).toEqualTypeOf<Promise<MyCanvasLayer>>();
expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer.tearDown()).toEqualTypeOf<Promise<MyCanvasLayer>>();
