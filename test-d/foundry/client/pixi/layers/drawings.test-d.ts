import { expectType } from "tsd";

expectType<"Drawing">(DrawingsLayer.documentName);
expectType<DrawingsLayer | undefined>(DrawingsLayer.instance);
expectType<DrawingsLayer.LayerOptions>(DrawingsLayer.layerOptions);
expectType<"drawings">(DrawingsLayer.layerOptions.name);
expectType<typeof Drawing>(DrawingsLayer.layerOptions.objectClass);
expectType<"defaultDrawingConfig">(DrawingsLayer.DEFAULT_CONFIG_SETTING);

const layer = new DrawingsLayer();
expectType<typeof Drawing>(layer.options.objectClass);
expectType<DrawingsLayer.LayerOptions>(layer.options);
expectType<"drawings">(layer.options.name);
expectType<16 | 8 | 0>(layer.gridPrecision);
expectType<DrawingHUD>(layer.hud);
expectType<void>(layer.configureDefault());
expectType<DrawingsLayer>(layer.deactivate());
