import { expectTypeOf } from "vitest";

import CanvasLayer = foundry.canvas.layers.CanvasLayer;
import EffectsCanvasGroup = foundry.canvas.groups.EffectsCanvasGroup;

declare global {
  namespace CONFIG.Canvas {
    interface Layers {
      testCanvasLayer: CONFIG.Canvas.LayerDefinition<typeof MyCanvasLayer, "primary">;
    }
  }
}

interface MyLayerOptions extends CanvasLayer.LayerOptions {
  name: "testCanvasLayer";
  baseClass: typeof MyCanvasLayer;
}

interface MyDrawOptions extends CanvasLayer.DrawOptions {
  foo?: boolean;
}

declare class MyCanvasLayer extends CanvasLayer {
  override options: MyLayerOptions;

  static override get layerOptions(): MyLayerOptions;

  protected override _draw(_options: MyDrawOptions): Promise<void>;
}

expectTypeOf(MyCanvasLayer.instance).toEqualTypeOf<CanvasLayer.Any | EffectsCanvasGroup.Implementation | undefined>;

const layer = new MyCanvasLayer();

expectTypeOf(layer.name).toEqualTypeOf<string>();
expectTypeOf(layer.hookName).toEqualTypeOf<string>();
expectTypeOf(layer.options.baseClass).toEqualTypeOf<typeof MyCanvasLayer>();
expectTypeOf(layer.draw()).toEqualTypeOf<Promise<MyCanvasLayer>>();
expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer.tearDown()).toEqualTypeOf<Promise<MyCanvasLayer>>();
