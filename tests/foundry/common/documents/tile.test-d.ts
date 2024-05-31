import { expectTypeOf } from "vitest";

//@ts-expect-error Width and height must be provided
expectTypeOf(new foundry.documents.BaseTile()).toEqualTypeOf<foundry.documents.BaseTile>();

//@ts-expect-error Width and height must be provided
expectTypeOf(new foundry.documents.BaseTile({})).toEqualTypeOf<foundry.documents.BaseTile>();

expectTypeOf(
  new foundry.documents.BaseTile({
    _id: undefined,
    img: undefined,
    width: 100,
    height: 100,
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
).toEqualTypeOf<foundry.documents.BaseTile>();

expectTypeOf(
  new foundry.documents.BaseTile({
    _id: null,
    img: null,
    width: 100,
    height: 100,
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
).toEqualTypeOf<foundry.documents.BaseTile>();

expectTypeOf(
  new foundry.documents.BaseTile({
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
).toEqualTypeOf<foundry.documents.BaseTile>();

expectTypeOf(
  new foundry.documents.BaseTile({
    occlusion: {},
  }),
).toEqualTypeOf<foundry.documents.BaseTile>();

new foundry.documents.BaseTile({
  // @ts-expect-error mode cannot be an arbitrary number.
  occlusion: { mode: 999 },
});

expectTypeOf(
  new foundry.documents.BaseTile({
    video: {},
  }),
).toEqualTypeOf<foundry.documents.BaseTile>();
