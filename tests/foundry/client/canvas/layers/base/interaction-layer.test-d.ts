import { expectTypeOf } from "vitest";
import type { AnyObject } from "fvtt-types/utils";
import { InteractionLayer } from "#client/canvas/layers/_module.mjs";

interface MyInteractionLayerOptions extends InteractionLayer.LayerOptions {
  name: "MyInteractionLayer";
  baseClass: typeof MyInteractionLayer;
}

declare class MyInteractionLayer extends InteractionLayer {
  override get hookName(): "MyInteractionLayer";

  override options: MyInteractionLayerOptions;

  static override get layerOptions(): MyInteractionLayerOptions;

  protected override _draw(options: AnyObject): Promise<void>;
}

expectTypeOf(MyInteractionLayer.layerOptions.baseClass).toEqualTypeOf<typeof MyInteractionLayer>;

declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
declare const someUser: User.Implementation;
const layer = new MyInteractionLayer();

expectTypeOf(layer.name).toEqualTypeOf<string>();
expectTypeOf(layer.hookName).toEqualTypeOf<"MyInteractionLayer">();

expectTypeOf(layer.activate()).toEqualTypeOf<MyInteractionLayer>();
expectTypeOf(layer.activate({})).toEqualTypeOf<MyInteractionLayer>();
expectTypeOf(layer.activate({ tool: "foo" })).toEqualTypeOf<MyInteractionLayer>();

expectTypeOf(layer["_activate"]()).toBeVoid();
expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer.getZIndex()).toBeNumber();
expectTypeOf(layer["_canDragLeftStart"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(layer["_onDragLeftStart"](pointerEvent)).toBeVoid();
