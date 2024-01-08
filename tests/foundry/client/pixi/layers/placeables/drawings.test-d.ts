import { expectTypeOf } from "vitest";

expectTypeOf(DrawingsLayer.documentName).toEqualTypeOf<"Drawing">();
expectTypeOf(DrawingsLayer.instance).toEqualTypeOf<DrawingsLayer | undefined>();
expectTypeOf(DrawingsLayer.layerOptions).toEqualTypeOf<DrawingsLayer.LayerOptions>();
expectTypeOf(DrawingsLayer.layerOptions.name).toEqualTypeOf<"drawings">();
expectTypeOf(DrawingsLayer.layerOptions.objectClass).toEqualTypeOf<typeof Drawing>();
expectTypeOf(DrawingsLayer.DEFAULT_CONFIG_SETTING).toEqualTypeOf<"defaultDrawingConfig">();

const layer = new DrawingsLayer();
expectTypeOf(layer.options.objectClass).toEqualTypeOf<typeof Drawing>();
expectTypeOf(layer.options).toEqualTypeOf<DrawingsLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"drawings">();
expectTypeOf(layer.gridPrecision).toEqualTypeOf<16 | 8 | 0>();
expectTypeOf(layer.hud).toEqualTypeOf<DrawingHUD>();
expectTypeOf(layer.configureDefault()).toEqualTypeOf<void>();
expectTypeOf(layer.deactivate()).toEqualTypeOf<DrawingsLayer>();
