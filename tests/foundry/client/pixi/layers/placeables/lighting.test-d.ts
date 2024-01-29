import { expectTypeOf } from "vitest";

expectTypeOf(LightingLayer.instance).toEqualTypeOf<LightingLayer | undefined>();
expectTypeOf(LightingLayer.layerOptions.objectClass).toEqualTypeOf<typeof AmbientLight>();

const layer = new LightingLayer();
expectTypeOf(layer.options.objectClass).toEqualTypeOf<typeof AmbientLight>();
expectTypeOf(layer.options).toEqualTypeOf<LightingLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"lighting">();
