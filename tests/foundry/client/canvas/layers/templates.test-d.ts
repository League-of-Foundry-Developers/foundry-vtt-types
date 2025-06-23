import { expectTypeOf } from "vitest";
import { TemplateLayer } from "#client/canvas/layers/_module.mjs";
import type { MeasuredTemplate } from "#client/canvas/placeables/_module.d.mts";

expectTypeOf(TemplateLayer.documentName).toEqualTypeOf<"MeasuredTemplate">();
expectTypeOf(TemplateLayer.instance).toEqualTypeOf<TemplateLayer | undefined>();
expectTypeOf(TemplateLayer.layerOptions).toEqualTypeOf<TemplateLayer.LayerOptions>();
expectTypeOf(TemplateLayer.layerOptions.name).toEqualTypeOf<"templates">();
expectTypeOf(TemplateLayer.layerOptions.objectClass).toEqualTypeOf<MeasuredTemplate.ImplementationClass>();
expectTypeOf(TemplateLayer.registerSettings()).toEqualTypeOf<void>();

const layer = new TemplateLayer();

expectTypeOf(layer.options.objectClass).toEqualTypeOf<MeasuredTemplate.ImplementationClass>();
expectTypeOf(layer.options).toEqualTypeOf<TemplateLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"templates">();

expectTypeOf(layer.hookName).toEqualTypeOf<"TemplateLayer">;

expectTypeOf(layer["_deactivate"]()).toBeVoid();
expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();

declare const pointerEvent: foundry.canvas.Canvas.Event.Pointer;
declare const someWheelEvent: WheelEvent;
expectTypeOf(layer["_onDragLeftStart"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftMove"](pointerEvent)).toBeVoid();
expectTypeOf(layer["_onMouseWheel"](someWheelEvent)).toEqualTypeOf<Promise<MeasuredTemplate.Implementation> | void>();
