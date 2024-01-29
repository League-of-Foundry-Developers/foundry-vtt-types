import { expectTypeOf } from "vitest";

expectTypeOf(TilesLayer.instance).toEqualTypeOf<TilesLayer | undefined>();
expectTypeOf(TilesLayer.layerOptions.objectClass).toEqualTypeOf<typeof Tile>();

const layer = new TilesLayer();
expectTypeOf(layer.options.objectClass).toEqualTypeOf<typeof Tile>();
expectTypeOf(layer.options).toEqualTypeOf<TilesLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"tiles">();
