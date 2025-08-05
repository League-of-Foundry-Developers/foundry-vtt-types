import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";

import InteractionLayer = foundry.canvas.layers.InteractionLayer;

declare module "fvtt-types/configuration" {
  namespace Hooks {
    interface InteractionLayerConfig {
      TestInteractionLayer: TestInteractionLayer;
    }
  }
}

declare global {
  namespace CONFIG.Canvas {
    interface Layers {
      testInteractionLayer: CONFIG.Canvas.LayerDefinition<typeof TestInteractionLayer, "primary">;
    }
  }
}

interface TestInteractionLayerOptions extends InteractionLayer.LayerOptions {
  name: "testInteractionLayer";
  baseClass: typeof TestInteractionLayer;
}

declare class TestInteractionLayer extends InteractionLayer {
  override options: TestInteractionLayerOptions;

  static override get layerOptions(): TestInteractionLayerOptions;

  protected override _draw(options: AnyObject): Promise<void>;
}

expectTypeOf(TestInteractionLayer.layerOptions.baseClass).toEqualTypeOf<typeof TestInteractionLayer>;

declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
declare const someUser: User.Implementation;
const layer = new TestInteractionLayer();

expectTypeOf(layer.name).toEqualTypeOf<string>();

expectTypeOf(layer.activate()).toEqualTypeOf<TestInteractionLayer>();
expectTypeOf(layer.activate({})).toEqualTypeOf<TestInteractionLayer>();
expectTypeOf(layer.activate({ tool: "foo" })).toEqualTypeOf<TestInteractionLayer>();

expectTypeOf(layer["_activate"]()).toBeVoid();
expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer.getZIndex()).toBeNumber();
expectTypeOf(layer["_canDragLeftStart"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(layer["_onDragLeftStart"](pointerEvent)).toBeVoid();
