import { expectTypeOf } from "vitest";
import { LightingLayer } from "#client/canvas/layers/_module.mjs";
import type { AmbientLight } from "#client/canvas/placeables/_module.d.mts";

expectTypeOf(LightingLayer.documentName).toEqualTypeOf<"AmbientLight">();
expectTypeOf(LightingLayer.instance).toEqualTypeOf<LightingLayer | undefined>();
expectTypeOf(LightingLayer.layerOptions).toEqualTypeOf<LightingLayer.LayerOptions>();
expectTypeOf(LightingLayer.layerOptions.name).toEqualTypeOf<"lighting">();
expectTypeOf(LightingLayer.layerOptions.objectClass).toEqualTypeOf<AmbientLight.ImplementationClass>();

const layer = new LightingLayer();

expectTypeOf(layer.options.objectClass).toEqualTypeOf<AmbientLight.ImplementationClass>();
expectTypeOf(layer.options).toEqualTypeOf<LightingLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"lighting">();

expectTypeOf(layer.hookName).toEqualTypeOf<"LightingLayer">();

expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer["_tearDown"]({})).toEqualTypeOf<Promise<void>>();

expectTypeOf(layer.refreshFields()).toBeVoid();
expectTypeOf(layer["_activate"]()).toBeVoid();

declare const someUser: User.Implementation;
declare const someEvent: PIXI.FederatedEvent;
declare const somePointerEvent: PointerEvent;
declare const someWheelEvent: WheelEvent;
expectTypeOf(layer["_canDragLeftStart"](someUser, someEvent)).toBeBoolean();
expectTypeOf(layer["_onDragLeftStart"](someEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftMove"](someEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftCancel"](somePointerEvent)).toBeVoid();
expectTypeOf(layer["_onMouseWheel"](someWheelEvent)).toEqualTypeOf<Promise<AmbientLight.Implementation>>();
expectTypeOf(layer["_onDarknessChange"](someEvent)).toBeVoid();
