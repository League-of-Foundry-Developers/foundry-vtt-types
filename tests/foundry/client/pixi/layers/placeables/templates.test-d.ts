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
expectTypeOf(layer.activate()).toEqualTypeOf<TemplateLayer>();
expectTypeOf(layer.deactivate()).toEqualTypeOf<TemplateLayer>();
