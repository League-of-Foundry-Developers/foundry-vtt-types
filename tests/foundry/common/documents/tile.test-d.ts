import { expectTypeOf } from "vitest";

// @ts-expect-error Width and height must be provided
expectTypeOf(new foundry.documents.BaseTile()).toEqualTypeOf<foundry.documents.BaseTile>();

// @ts-expect-error Width and height must be provided
expectTypeOf(new foundry.documents.BaseTile({})).toEqualTypeOf<foundry.documents.BaseTile>();

expectTypeOf(
  new foundry.documents.BaseTile({
    _id: undefined,
    texture: undefined,
    width: 100,
    height: 100,
    x: undefined,
    y: undefined,
    z: undefined,
    rotation: undefined,
    alpha: undefined,
    hidden: undefined,
    locked: undefined,
    overhead: undefined,
    occlusion: undefined,
    video: undefined,
    flags: undefined,
  }),
).toEqualTypeOf<foundry.documents.BaseTile>();

expectTypeOf(
  new foundry.documents.BaseTile({
    _id: null,
    texture: null,
    width: 100,
    height: 100,
    x: null,
    y: null,
    elevation: 0.0,
    sort: 0,
    rotation: null,
    alpha: null,
    hidden: null,
    locked: null,
    overhead: null,
    occlusion: null,
    video: null,
    flags: null,
  }),
).toEqualTypeOf<foundry.documents.BaseTile>();

expectTypeOf(
  new foundry.documents.BaseTile({
    _id: "BGBEITBTEIGE",
    texture: {
      src: "path/to/some/image.png",
      tint: "#FF0000",
    },
    width: 100,
    height: 200,
    x: 300,
    y: 500,
    elevation: 200.2,
    sort: 1,
    rotation: 0,
    alpha: 0,
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
).toEqualTypeOf<foundry.documents.BaseTile>();

// @ts-expect-error width and height may not be null
new foundry.documents.BaseTile({
  occlusion: {},
});

// @ts-expect-error mode cannot be an arbitrary number.
new foundry.documents.BaseTile({
  width: 300,
  height: 300,
  occlusion: { mode: 999 },
});

expectTypeOf(
  new foundry.documents.BaseTile({
    video: {},
    width: 300,
    height: 300,
  }),
).toEqualTypeOf<foundry.documents.BaseTile>();

declare const myTile: foundry.documents.BaseTile;

expectTypeOf(myTile.overhead).toEqualTypeOf<boolean>();
