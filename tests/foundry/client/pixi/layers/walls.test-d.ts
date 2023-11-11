import { expectTypeOf } from "vitest";

expectTypeOf(WallsLayer.instance).toEqualTypeOf<WallsLayer | undefined>();
expectTypeOf(WallsLayer.layerOptions.objectClass).toEqualTypeOf<typeof Wall>();

const layer = new WallsLayer();
expectTypeOf(layer.options.objectClass).toEqualTypeOf<typeof Wall>();
expectTypeOf(layer.options).toEqualTypeOf<WallsLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"walls">();

expectTypeOf(layer.checkCollision(new Ray({ x: 100, y: 100 }, { x: 100, y: 100 }))).toEqualTypeOf<boolean>();
expectTypeOf(
  layer.checkCollision(new Ray({ x: 100, y: 100 }, { x: 100, y: 100 }), { type: "move" }),
).toEqualTypeOf<boolean>();
expectTypeOf(
  layer.checkCollision(new Ray({ x: 100, y: 100 }, { x: 100, y: 100 }), { type: "sight" }),
).toEqualTypeOf<boolean>();
expectTypeOf(
  layer.checkCollision(new Ray({ x: 100, y: 100 }, { x: 100, y: 100 }), { type: "sound" }),
).toEqualTypeOf<boolean>();
expectTypeOf(
  layer.checkCollision(new Ray({ x: 100, y: 100 }, { x: 100, y: 100 }), { mode: "any" }),
).toEqualTypeOf<boolean>();

expectTypeOf(layer.checkCollision(new Ray({ x: 100, y: 100 }, { x: 100, y: 100 }), { mode: "closest" })).toEqualTypeOf<
  PolygonVertex | boolean
>();
expectTypeOf(layer.checkCollision(new Ray({ x: 100, y: 100 }, { x: 100, y: 100 }), { mode: "all" })).toEqualTypeOf<
  PolygonVertex[] | boolean
>();

expectTypeOf(layer.pasteObjects({ x: 900, y: 800 })).toEqualTypeOf<Promise<WallDocument[]>>();
expectTypeOf(layer.pasteObjects({ x: 900, y: 800 }, {})).toEqualTypeOf<Promise<WallDocument[]>>();
expectTypeOf(layer.pasteObjects({ x: 900, y: 800 }, { hidden: true, snap: true })).toEqualTypeOf<
  Promise<WallDocument[]>
>();
