import { expectTypeOf } from "vitest";
import type { HandleEmptyObject } from "../../../../../../src/utils/index.d.mts";

interface MyInteractionLayerOptions extends InteractionLayer.LayerOptions {
  name: "MyInteractionLayer";
  baseClass: typeof MyInteractionLayer;
}

declare class MyInteractionLayer extends InteractionLayer {
  override get hookName(): "MyInteractionLayer";

  override options: MyInteractionLayerOptions;

  static override get layerOptions(): MyInteractionLayerOptions;

  protected override _draw(options: HandleEmptyObject<InteractionLayer.DrawOptions>): Promise<void>;
}

expectTypeOf(MyInteractionLayer.layerOptions.baseClass).toEqualTypeOf<typeof MyInteractionLayer>;

declare const someEvent: PIXI.FederatedEvent;
declare const someUser: User.ConfiguredInstance;
const layer = new MyInteractionLayer();

expectTypeOf(layer.name).toEqualTypeOf<string>();
expectTypeOf(layer.hookName).toEqualTypeOf<"MyInteractionLayer">();

expectTypeOf(layer.activate()).toEqualTypeOf<MyInteractionLayer>();
expectTypeOf(layer.activate({})).toEqualTypeOf<MyInteractionLayer>();
expectTypeOf(layer.activate({ tool: "foo" })).toEqualTypeOf<MyInteractionLayer>();

expectTypeOf(layer["_activate"]()).toBeVoid();
expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer.getZIndex()).toBeNumber();
expectTypeOf(layer["_canDragLeftStart"](someUser, someEvent)).toBeBoolean();
expectTypeOf(layer["_onDragLeftStart"](someEvent)).toBeVoid();
