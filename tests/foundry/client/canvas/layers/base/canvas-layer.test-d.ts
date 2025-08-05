import { expectTypeOf } from "vitest";
import type { AnyObject } from "#utils";

import CanvasLayer = foundry.canvas.layers.CanvasLayer;
import EffectsCanvasGroup = foundry.canvas.groups.EffectsCanvasGroup;

declare module "fvtt-types/configuration" {
  namespace Hooks {
    interface CanvasLayerConfig {
      TestCanvasLayer: TestCanvasLayer;
    }
  }
}

declare global {
  namespace CONFIG.Canvas {
    interface Layers {
      testCanvasLayer: CONFIG.Canvas.LayerDefinition<typeof TestCanvasLayer, "primary">;
    }
  }
}

interface TestCanvasLayerOptions extends CanvasLayer.LayerOptions {
  name: "testCanvasLayer";
  baseClass: typeof TestCanvasLayer;
}

declare class TestCanvasLayer extends CanvasLayer {
  override options: TestCanvasLayerOptions;

  static override get layerOptions(): TestCanvasLayerOptions;

  protected override _draw(_options: AnyObject): Promise<void>;
}

expectTypeOf(TestCanvasLayer.instance).toEqualTypeOf<CanvasLayer.Any | EffectsCanvasGroup.Implementation | undefined>;

const layer = new TestCanvasLayer();

expectTypeOf(layer.name).toEqualTypeOf<string>();
expectTypeOf(layer.hookName).toEqualTypeOf<string>();
expectTypeOf(layer.options.baseClass).toEqualTypeOf<typeof TestCanvasLayer>();
expectTypeOf(layer.draw()).toEqualTypeOf<Promise<TestCanvasLayer>>();
expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer.tearDown()).toEqualTypeOf<Promise<TestCanvasLayer>>();

Hooks.on("drawTestCanvasLayer", (layer) => {
  expectTypeOf(layer).toEqualTypeOf<TestCanvasLayer>();
});
