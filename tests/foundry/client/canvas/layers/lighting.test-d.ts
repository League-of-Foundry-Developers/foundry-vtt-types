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
declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
declare const wheelEvent: foundry.canvas.Canvas.Event.Wheel;
declare const darknessChangeEvent: foundry.canvas.Canvas.Event.DarknessChange;
expectTypeOf(layer["_canDragLeftStart"](someUser, pointerEvent)).toBeBoolean();
expectTypeOf(layer["_onDragLeftStart"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftMove"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftCancel"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onMouseWheel"](wheelEvent)).toEqualTypeOf<Promise<AmbientLight.Implementation>>();
expectTypeOf(layer["_onDarknessChange"](darknessChangeEvent)).toBeVoid();
