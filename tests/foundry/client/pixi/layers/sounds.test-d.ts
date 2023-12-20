import { expectTypeOf } from "vitest";

expectTypeOf(SoundsLayer.instance).toEqualTypeOf<SoundsLayer | undefined>();
expectTypeOf(SoundsLayer.layerOptions.objectClass).toEqualTypeOf<typeof AmbientSound>();

const layer = new SoundsLayer();
expectTypeOf(layer.options.objectClass).toEqualTypeOf<typeof AmbientSound>();
expectTypeOf(layer.options).toEqualTypeOf<SoundsLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"sounds">();
