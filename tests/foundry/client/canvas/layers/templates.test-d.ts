import { expectTypeOf } from "vitest";

// eslint-disable-next-line @typescript-eslint/no-deprecated
import TemplateLayer = foundry.canvas.layers.TemplateLayer;
import MeasuredTemplate = foundry.canvas.placeables.MeasuredTemplate;

// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(TemplateLayer.documentName).toEqualTypeOf<"MeasuredTemplate">();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(TemplateLayer.instance).toEqualTypeOf<TemplateLayer | undefined>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(TemplateLayer.layerOptions).toEqualTypeOf<TemplateLayer.LayerOptions>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(TemplateLayer.layerOptions.name).toEqualTypeOf<"templates">();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(TemplateLayer.layerOptions.objectClass).toEqualTypeOf<MeasuredTemplate.ImplementationClass>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(TemplateLayer.registerSettings()).toEqualTypeOf<void>();

// eslint-disable-next-line @typescript-eslint/no-deprecated
const layer = new TemplateLayer();

expectTypeOf(layer.options.objectClass).toEqualTypeOf<MeasuredTemplate.ImplementationClass>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
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
