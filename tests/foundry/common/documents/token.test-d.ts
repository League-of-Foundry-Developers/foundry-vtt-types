import { expectTypeOf } from "vitest";
import type { InterfaceToObject } from "fvtt-types/utils";
import { TokenRing } from "#client/canvas/placeables/tokens/_module.mjs";

import BaseToken = foundry.documents.BaseToken;
import Document = foundry.abstract.Document;

class TestBaseToken extends foundry.documents.BaseToken {}

// Token has no hard required fields for construction
let myToken = new TestBaseToken();
myToken = new TestBaseToken({});
myToken = new TestBaseToken({
  _id: "XXXXXSomeIDXXXXX",
  name: "Foo the Barbazian",
  displayName: CONST.TOKEN_DISPLAY_MODES.OWNER,
  actorId: "YYYYYSomeIDYYYYY",
  actorLink: false,
  delta: {
    // not going to include the entire Actor schema here
    name: "Foo the Barbazian",
  },
  appendNumber: true,
  prependAdjective: true,
  width: 2,
  height: 3,
  texture: {
    alphaThreshold: 0.9,
    anchorX: 0.7,
    anchorY: 0.8,
    fit: "cover",
    offsetX: -5,
    offsetY: -3,
    rotation: 35,
    scaleX: 3.12,
    scaleY: 2.65,
    src: "path/to/file.jpg",
    tint: "#7EBF62",
  },
  shape: CONST.TOKEN_SHAPES.TRAPEZOID_1,
  x: 500,
  y: 737,
  elevation: -50,
  sort: 0x42,
  locked: true,
  rotation: 99,
  alpha: 0.87,
  hidden: false,
  disposition: CONST.TOKEN_DISPOSITIONS.SECRET,
  displayBars: CONST.TOKEN_DISPLAY_MODES.ALWAYS,
  bar1: { attribute: "fizzbuzz" },
  bar2: { attribute: "buzzfizz" },
  light: {
    negative: true,
    priority: 42,
    alpha: 0.1,
    angle: 90,
    bright: 20,
    color: "#ABCFED",
    coloration: 9, // INVERT_ABSORPTION
    dim: 40,
    attenuation: 0.34,
    luminosity: 0.8,
    saturation: -0.8,
    contrast: -0.23,
    shadows: 0.41,
    animation: {
      intensity: 3,
      reverse: true,
      speed: 7,
      type: "fairy",
    },
    darkness: { min: 0.77, max: 0.99 },
  },
  sight: {
    enabled: true,
    range: 600,
    angle: 127,
    visionMode: "darkvision",
    color: "#FA12BD",
    attenuation: 0.3,
    brightness: -0.1,
    saturation: 0.6,
    contrast: -0.21,
  },
  detectionModes: [
    {
      enabled: true,
      id: "lightPerception",
      range: 500,
    },
  ],
  occludable: {
    radius: 10,
  },
  ring: {
    enabled: true,
    colors: {
      ring: "#FAAAAF",
      background: "#AFFFFA",
    },
    effects: TokenRing.effects.BKG_WAVE + TokenRing.effects.RING_GRADIENT,
    subject: {
      scale: 2.78,
      texture: "path/to/subject.webp",
    },
  },
  _regions: ["ZZZZZSomeIDZZZZZ"],
  flags: {
    core: {
      animationSeed: 0o42,
      randomizeVideo: true,
    },
  },
});

// omitting the null and undefined construction cases due to size and coverage on other documents

expectTypeOf(myToken).toEqualTypeOf<BaseToken>();

expectTypeOf(myToken._id).toEqualTypeOf<string | null>();
expectTypeOf(myToken.name).toBeString();
expectTypeOf(myToken.displayName).toEqualTypeOf<CONST.TOKEN_DISPLAY_MODES>();
expectTypeOf(myToken.actorId).toEqualTypeOf<string | null>();
expectTypeOf(myToken.actorLink).toBeBoolean();
expectTypeOf(myToken.delta).toEqualTypeOf<ActorDelta.Implementation | null>();
expectTypeOf(myToken.appendNumber).toBeBoolean();
expectTypeOf(myToken.prependAdjective).toBeBoolean();

// TextureData schema tests are in `tests/foundry/common/data/data.test-d.ts`
expectTypeOf(myToken.texture).toEqualTypeOf<
  foundry.data.fields.SchemaField.InitializedData<foundry.data.TextureData.Schema>
>();

expectTypeOf(myToken.hexagonalShape).toEqualTypeOf<CONST.TOKEN_HEXAGONAL_SHAPES>();
expectTypeOf(myToken.x).toBeNumber();
expectTypeOf(myToken.y).toBeNumber();
expectTypeOf(myToken.elevation).toBeNumber();
expectTypeOf(myToken.sort).toBeNumber();
expectTypeOf(myToken.locked).toBeBoolean();
expectTypeOf(myToken.lockRotation).toBeBoolean();
expectTypeOf(myToken.rotation).toBeNumber();
expectTypeOf(myToken.alpha).toBeNumber();
expectTypeOf(myToken.hidden).toBeBoolean();
expectTypeOf(myToken.disposition).toEqualTypeOf<CONST.TOKEN_DISPOSITIONS>();
expectTypeOf(myToken.displayBars).toEqualTypeOf<CONST.TOKEN_DISPLAY_MODES>();
expectTypeOf(myToken.bar1.attribute).toEqualTypeOf<string | null>();
expectTypeOf(myToken.bar2.attribute).toEqualTypeOf<string | null>();

// LightData schema tests are in `tests/foundry/common/data/data.test-d.ts`
expectTypeOf(myToken.light).toEqualTypeOf<foundry.data.LightData>();

expectTypeOf(myToken.sight.enabled).toBeBoolean();
expectTypeOf(myToken.sight.range).toEqualTypeOf<number | null>();
expectTypeOf(myToken.sight.angle).toBeNumber();
expectTypeOf(myToken.sight.visionMode).toBeString();
expectTypeOf(myToken.sight.color).toEqualTypeOf<Color | null | undefined>;
expectTypeOf(myToken.sight.attenuation).toBeNumber();
expectTypeOf(myToken.sight.brightness).toBeNumber();
expectTypeOf(myToken.sight.saturation).toBeNumber();
expectTypeOf(myToken.sight.contrast).toBeNumber();
if (myToken.detectionModes[0]) {
  expectTypeOf(myToken.detectionModes[0].id).toEqualTypeOf<string | undefined>();
  expectTypeOf(myToken.detectionModes[0].enabled).toBeBoolean();
  expectTypeOf(myToken.detectionModes[0].range).toEqualTypeOf<number | null>();
}
expectTypeOf(myToken.ring.enabled).toBeBoolean();
expectTypeOf(myToken.ring.subject.texture).toEqualTypeOf<string | null | undefined>();
// TODO: ArrayField<ForeignDocumentField> is returning `never[]`
expectTypeOf(myToken._regions).toEqualTypeOf<Array<string | null>>();
expectTypeOf(myToken.flags).toEqualTypeOf<
  foundry.data.fields.DocumentFlagsField._TwoLevelPartial<
    InterfaceToObject<TokenDocument.CoreFlags> & InterfaceToObject<Document.CoreFlags>
  >
>();

// The following fields can't really be `undefined` because they have `initial`s, see https://github.com/League-of-Foundry-Developers/foundry-vtt-types/issues/3055
expectTypeOf(myToken.width).toEqualTypeOf<number | undefined>();
expectTypeOf(myToken.height).toEqualTypeOf<number | undefined>();
expectTypeOf(myToken.occludable.radius).toEqualTypeOf<number>();
expectTypeOf(myToken.ring.colors.ring).toEqualTypeOf<Color | null | undefined>();
expectTypeOf(myToken.ring.colors.background).toEqualTypeOf<Color | null | undefined>();
expectTypeOf(myToken.ring.effects).toEqualTypeOf<number | null>();
expectTypeOf(myToken.ring.subject.scale).toEqualTypeOf<number>();
