import { expectTypeOf } from "vitest";

expectTypeOf(LightingLayer.instance).toEqualTypeOf<LightingLayer | undefined>();
expectTypeOf(LightingLayer.layerOptions.objectClass).toEqualTypeOf<typeof AmbientLight>();

const layer = new LightingLayer();
expectTypeOf(layer.options.objectClass).toEqualTypeOf<typeof AmbientLight>();
expectTypeOf(layer.options).toEqualTypeOf<LightingLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"lighting">();

expectTypeOf(layer.animateDarkness()).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer.animateDarkness(1.0)).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer.animateDarkness(1.0, {})).toEqualTypeOf<Promise<void>>();
expectTypeOf(layer.animateDarkness(1.0, { duration: 10000 })).toEqualTypeOf<Promise<void>>();
