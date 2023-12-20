import { expectTypeOf } from "vitest";

expectTypeOf(new foundry.data.TileData()).toEqualTypeOf<foundry.data.TileData>();

expectTypeOf(new foundry.data.TileData({})).toEqualTypeOf<foundry.data.TileData>();

expectTypeOf(
  new foundry.data.TileData({
    _id: undefined,
    img: undefined,
    width: undefined,
    height: undefined,
    x: undefined,
    y: undefined,
    z: undefined,
    rotation: undefined,
    alpha: undefined,
    tint: undefined,
    hidden: undefined,
    locked: undefined,
    overhead: undefined,
    occlusion: undefined,
    video: undefined,
    flags: undefined,
  }),
).toEqualTypeOf<foundry.data.TileData>();

expectTypeOf(
  new foundry.data.TileData({
    _id: null,
    img: null,
    width: null,
    height: null,
    x: null,
    y: null,
    z: null,
    rotation: null,
    alpha: null,
    tint: null,
    hidden: null,
    locked: null,
    overhead: null,
    occlusion: null,
    video: null,
    flags: null,
  }),
).toEqualTypeOf<foundry.data.TileData>();

expectTypeOf(
  new foundry.data.TileData({
    _id: "BGBEITBTEIGE",
    img: "path/to/some/image.png",
    width: 100,
    height: 200,
    x: 300,
    y: 500,
    z: 100,
    rotation: 0,
    alpha: 0,
    tint: "#FF0000",
    hidden: true,
    locked: false,
    overhead: true,
    occlusion: {
      mode: foundry.CONST.TILE_OCCLUSION_MODES.FADE,
      alpha: 1,
    },
    video: {
      loop: true,
      autoplay: true,
      volume: 0.5,
    },
    flags: {},
  }),
).toEqualTypeOf<foundry.data.TileData>();

expectTypeOf(
  new foundry.data.TileData({
    occlusion: {},
  }),
).toEqualTypeOf<foundry.data.TileData>();

new foundry.data.TileData({
  // @ts-expect-error mode cannot be an arbitrary number.
  occlusion: { mode: 999 },
});

expectTypeOf(
  new foundry.data.TileData({
    video: {},
  }),
).toEqualTypeOf<foundry.data.TileData>();
