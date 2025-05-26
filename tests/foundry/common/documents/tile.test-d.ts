import { expectTypeOf } from "vitest";
import type { InterfaceToObject } from "fvtt-types/utils";
import BaseTile = foundry.documents.BaseTile;
import Document = foundry.abstract.Document;

class TestTile extends BaseTile {}

// @ts-expect-error Tiles require a provided width and height
new TestTile();

// @ts-expect-error Tiles require a provided width and height
new TestTile({});

let myTile = new TestTile({
  _id: "XXXXXSomeIDXXXXX",
  texture: {
    src: "path/to/some/image.png",
    tint: "#FF0000",
    alphaThreshold: 0.2,
    anchorX: 0.2,
    anchorY: 0.2,
    fit: "contain",
    offsetX: 10,
    offsetY: 10,
    rotation: 74,
    scaleX: 0.8,
    scaleY: 1.2,
  },
  width: 200, // actually required for construction
  height: 200, // actually required for construction
  x: 300,
  y: 500,
  elevation: 20,
  sort: 23,
  rotation: 170,
  alpha: 0.67,
  hidden: true,
  locked: false,
  restrictions: {
    light: true,
    weather: false,
  },
  occlusion: {
    mode: CONST.OCCLUSION_MODES.FADE,
    alpha: 0.78,
  },
  video: {
    loop: true,
    autoplay: true,
    volume: 0.5,
  },
  flags: {
    core: {
      randomizeVideo: true,
    },
  },
});

myTile = new TestTile({
  _id: null,
  texture: {
    src: null,
    tint: null,
    alphaThreshold: null,
    anchorX: null,
    anchorY: null,
    fit: null,
    offsetX: null,
    offsetY: null,
    rotation: null,
    scaleX: null,
    scaleY: null,
  },
  width: 200, // actually required for construction
  height: 200, // actually required for construction
  x: null,
  y: null,
  elevation: null,
  sort: null,
  rotation: null,
  alpha: null,
  hidden: null,
  locked: null,
  restrictions: {
    light: null,
    weather: null,
  },
  occlusion: {
    mode: null,
    alpha: null,
  },
  video: {
    loop: null,
    autoplay: null,
    volume: null,
  },
  flags: null,
});
myTile = new TestTile({
  width: 200, // actually required for construction
  height: 200, // actually required for construction
  texture: null,
  restrictions: null,
  occlusion: null,
  video: null,
});

myTile = new TestTile({
  _id: undefined,
  texture: {
    src: undefined,
    tint: undefined,
    alphaThreshold: undefined,
    anchorX: undefined,
    anchorY: undefined,
    fit: undefined,
    offsetX: undefined,
    offsetY: undefined,
    rotation: undefined,
    scaleX: undefined,
    scaleY: undefined,
  },
  width: 200, // actually required for construction
  height: 200, // actually required for construction
  x: undefined,
  y: undefined,
  elevation: undefined,
  sort: undefined,
  rotation: undefined,
  alpha: undefined,
  hidden: undefined,
  locked: undefined,
  restrictions: {
    light: undefined,
    weather: undefined,
  },
  occlusion: {
    mode: undefined,
    alpha: undefined,
  },
  video: {
    loop: undefined,
    autoplay: undefined,
    volume: undefined,
  },
  flags: undefined,
});
myTile = new TestTile({
  width: 200, // actually required for construction
  height: 200, // actually required for construction
  texture: undefined,
  restrictions: undefined,
  occlusion: undefined,
  video: undefined,
});

expectTypeOf(myTile).toEqualTypeOf<BaseTile>();

expectTypeOf(myTile._id).toEqualTypeOf<string | null>();

// TextureData schema tests are in `tests/foundry/common/data/data.test-d.ts`
expectTypeOf(myTile.texture).toEqualTypeOf<
  foundry.data.fields.SchemaField.InitializedData<foundry.data.TextureData.Schema>
>();

expectTypeOf(myTile.width).toBeNumber();
expectTypeOf(myTile.height).toBeNumber();
expectTypeOf(myTile.x).toBeNumber();
expectTypeOf(myTile.y).toBeNumber();
expectTypeOf(myTile.elevation).toBeNumber();
expectTypeOf(myTile.sort).toBeNumber();
expectTypeOf(myTile.rotation).toBeNumber();
expectTypeOf(myTile.alpha).toBeNumber();
expectTypeOf(myTile.hidden).toBeBoolean();
expectTypeOf(myTile.locked).toBeBoolean();
expectTypeOf(myTile.restrictions.light).toBeBoolean();
expectTypeOf(myTile.restrictions.weather).toBeBoolean();
expectTypeOf(myTile.occlusion.mode).toEqualTypeOf<CONST.OCCLUSION_MODES | null>();
expectTypeOf(myTile.occlusion.alpha).toBeNumber();
expectTypeOf(myTile.video.loop).toBeBoolean();
expectTypeOf(myTile.video.autoplay).toBeBoolean();
expectTypeOf(myTile.video.volume).toBeNumber();
expectTypeOf(myTile.flags).toEqualTypeOf<
  InterfaceToObject<TileDocument.CoreFlags> & InterfaceToObject<Document.CoreFlags>
>();

// document-specific flag(s)
expectTypeOf(myTile.flags.core?.randomizeVideo).toEqualTypeOf<boolean | undefined>();

// non-schema:
expectTypeOf((myTile.roof = true)).toBeBoolean();
expectTypeOf(myTile.roof).toBeBoolean();
expectTypeOf(myTile.z).toBeNumber();
expectTypeOf(myTile.overhead).toBeBoolean();
