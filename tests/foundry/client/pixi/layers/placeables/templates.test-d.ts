import { expectTypeOf } from "vitest";

expectTypeOf(TemplateLayer.documentName).toEqualTypeOf<"MeasuredTemplate">();
expectTypeOf(TemplateLayer.instance).toEqualTypeOf<TemplateLayer | undefined>();
expectTypeOf(TemplateLayer.layerOptions).toEqualTypeOf<TemplateLayer.LayerOptions>();
expectTypeOf(TemplateLayer.layerOptions.name).toEqualTypeOf<"templates">();
expectTypeOf(TemplateLayer.layerOptions.objectClass).toEqualTypeOf<typeof MeasuredTemplate>();
expectTypeOf(TemplateLayer.registerSettings()).toEqualTypeOf<void>();

const layer = new TemplateLayer();

expectTypeOf(layer.options.objectClass).toEqualTypeOf<typeof MeasuredTemplate>();
expectTypeOf(layer.options).toEqualTypeOf<TemplateLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"templates">();

expectTypeOf(layer.hookName).toEqualTypeOf<"TemplateLayer">;

expectTypeOf(layer["_deactivate"]()).toBeVoid();
expectTypeOf(layer["_draw"]({})).toEqualTypeOf<Promise<void>>();

declare const someEvent: PIXI.FederatedEvent;
declare const someWheelEvent: WheelEvent;
expectTypeOf(layer["_onDragLeftStart"](someEvent)).toBeVoid();
expectTypeOf(layer["_onDragLeftMove"](someEvent)).toBeVoid();
expectTypeOf(
  layer["_onMouseWheel"](someWheelEvent),
).toEqualTypeOf<Promise<MeasuredTemplate.ConfiguredInstance> | void>();
