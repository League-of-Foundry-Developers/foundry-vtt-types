import { expectTypeOf } from "vitest";
import type { InterfaceToObject } from "fvtt-types/utils";
import BaseAmbientLight = foundry.documents.BaseAmbientLight;
import Document = foundry.abstract.Document;

class TestBaseAmbientLight extends BaseAmbientLight {}

// AmbientLight has no hard required fields for construction
new TestBaseAmbientLight();
new TestBaseAmbientLight({});

new TestBaseAmbientLight({
  _id: "XXXXXSomeIDXXXXX",
  x: 10,
  y: 10,
  elevation: 20,
  rotation: 180,
  walls: false,
  vision: true,
  config: {
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
  hidden: true,
  flags: {
    core: {
      animationSeed: 17,
    },
  },
});

new TestBaseAmbientLight({
  _id: null,
  x: null,
  y: null,
  elevation: null,
  rotation: null,
  walls: null,
  vision: null,
  config: {
    negative: null,
    priority: null,
    alpha: null,
    angle: null,
    bright: null,
    color: null,
    coloration: null,
    dim: null,
    attenuation: null,
    luminosity: null,
    saturation: null,
    contrast: null,
    shadows: null,
    animation: {
      intensity: null,
      reverse: null,
      speed: null,
      type: null,
    },
    darkness: { min: null, max: null },
  },
  hidden: null,
  flags: null,
});

new TestBaseAmbientLight({
  config: {
    animation: null,
    darkness: null,
  },
});

new TestBaseAmbientLight({
  config: null,
});

new TestBaseAmbientLight({
  _id: undefined,
  x: undefined,
  y: undefined,
  elevation: undefined,
  rotation: undefined,
  walls: undefined,
  vision: undefined,
  config: {
    negative: undefined,
    priority: undefined,
    alpha: undefined,
    angle: undefined,
    bright: undefined,
    color: undefined,
    coloration: undefined,
    dim: undefined,
    attenuation: undefined,
    luminosity: undefined,
    saturation: undefined,
    contrast: undefined,
    shadows: undefined,
    animation: {
      intensity: undefined,
      reverse: undefined,
      speed: undefined,
      type: undefined,
    },
    darkness: { min: undefined, max: undefined },
  },
  hidden: undefined,
  flags: undefined,
});

new TestBaseAmbientLight({
  config: {
    animation: undefined,
    darkness: undefined,
  },
});

const myLight = new TestBaseAmbientLight({
  config: undefined,
});

expectTypeOf(myLight).toEqualTypeOf<BaseAmbientLight>();

expectTypeOf(myLight._id).toEqualTypeOf<string | null>();
expectTypeOf(myLight.x).toBeNumber();
expectTypeOf(myLight.y).toBeNumber();
expectTypeOf(myLight.elevation).toBeNumber();
expectTypeOf(myLight.rotation).toBeNumber();
expectTypeOf(myLight.walls).toBeBoolean();
expectTypeOf(myLight.vision).toBeBoolean();

// LightData schema tests are in `tests/foundry/common/data/data.test-d.ts`
expectTypeOf(myLight.config).toEqualTypeOf<foundry.data.LightData>();

expectTypeOf(myLight.hidden).toBeBoolean();
expectTypeOf(myLight.flags).toEqualTypeOf<
  foundry.data.fields.DocumentFlagsField._TwoLevelPartial<
    InterfaceToObject<BaseAmbientLight.CoreFlags> & InterfaceToObject<Document.CoreFlags>
  >
>();

// document-specific flag(s)
expectTypeOf(myLight.flags?.core?.animationSeed).toEqualTypeOf<number | undefined>();
