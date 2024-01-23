import { expectTypeOf } from "vitest";

expectTypeOf(WallsLayer.instance).toEqualTypeOf<WallsLayer | undefined>();
expectTypeOf(WallsLayer.layerOptions.objectClass).toEqualTypeOf<typeof Wall>();

const layer = new WallsLayer();
expectTypeOf(layer.options.objectClass).toEqualTypeOf<typeof Wall>();
expectTypeOf(layer.options).toEqualTypeOf<WallsLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"walls">();

expectTypeOf(layer.pasteObjects({ x: 900, y: 800 })).toEqualTypeOf<Promise<WallDocument[]>>();
expectTypeOf(layer.pasteObjects({ x: 900, y: 800 }, {})).toEqualTypeOf<Promise<WallDocument[]>>();
expectTypeOf(layer.pasteObjects({ x: 900, y: 800 }, { hidden: true, snap: true })).toEqualTypeOf<
  Promise<WallDocument[]>
>();
