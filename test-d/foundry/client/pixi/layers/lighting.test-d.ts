import { expectType } from "tsd";

expectType<LightingLayer | undefined>(LightingLayer.instance);
expectType<typeof AmbientLight>(LightingLayer.layerOptions.objectClass);

const layer = new LightingLayer();
expectType<typeof AmbientLight>(layer.options.objectClass);
expectType<LightingLayer.LayerOptions>(layer.options);
expectType<"lighting">(layer.options.name);

expectType<Promise<void>>(layer.animateDarkness());
expectType<Promise<void>>(layer.animateDarkness(1.0));
expectType<Promise<void>>(layer.animateDarkness(1.0, {}));
expectType<Promise<void>>(layer.animateDarkness(1.0, { duration: 10000 }));
