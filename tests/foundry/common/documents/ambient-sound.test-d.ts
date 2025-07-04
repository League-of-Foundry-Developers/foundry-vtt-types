import { expectTypeOf } from "vitest";
import type { InterfaceToObject } from "fvtt-types/utils";

import BaseAmbientSound = foundry.documents.BaseAmbientSound;
import Document = foundry.abstract.Document;

class TestBaseAmbientSound extends BaseAmbientSound {}

// AmbientSound has no hard required fields for construction
new TestBaseAmbientSound();

new TestBaseAmbientSound({});

new TestBaseAmbientSound({
  _id: "XXXXXSomeIDXXXXX",
  x: 10,
  y: 10,
  elevation: 20,
  radius: 100,
  path: "path/to/file",
  repeat: true,
  volume: 100,
  walls: false,
  easing: true,
  hidden: true,
  darkness: { min: 10, max: 90 },
  effects: {
    base: {
      type: "highpass",
      intensity: 7,
    },
    muffled: {
      type: "reverb",
      intensity: 2,
    },
  },
  flags: {
    core: {
      sheetLock: false,
    },
  },
});

new TestBaseAmbientSound({
  _id: null,
  x: null,
  y: null,
  elevation: null,
  radius: null,
  path: null,
  repeat: null,
  volume: null,
  walls: null,
  easing: null,
  hidden: null,
  darkness: { min: null, max: null },
  effects: {
    base: {
      type: null,
      intensity: null,
    },
    muffled: {
      type: null,
      intensity: null,
    },
  },
  flags: null,
});

new TestBaseAmbientSound({
  darkness: null,
  effects: {
    base: null,
    muffled: null,
  },
});

new TestBaseAmbientSound({ effects: null });

new TestBaseAmbientSound({
  _id: undefined,
  x: undefined,
  y: undefined,
  elevation: undefined,
  radius: undefined,
  path: undefined,
  repeat: undefined,
  volume: undefined,
  walls: undefined,
  easing: undefined,
  hidden: undefined,
  darkness: { min: undefined, max: undefined },
  effects: {
    base: {
      type: undefined,
      intensity: undefined,
    },
    muffled: {
      type: undefined,
      intensity: undefined,
    },
  },
  flags: undefined,
});

new TestBaseAmbientSound({
  darkness: undefined,
  effects: {
    base: undefined,
    muffled: undefined,
  },
});

const mySound = new TestBaseAmbientSound({ effects: undefined });

expectTypeOf(mySound).toEqualTypeOf<BaseAmbientSound>();

expectTypeOf(mySound._id).toEqualTypeOf<string | null>();
expectTypeOf(mySound.x).toBeNumber();
expectTypeOf(mySound.y).toBeNumber();
expectTypeOf(mySound.elevation).toBeNumber();
expectTypeOf(mySound.radius).toBeNumber();
expectTypeOf(mySound.path).toEqualTypeOf<string | null>();
expectTypeOf(mySound.repeat).toBeBoolean();
expectTypeOf(mySound.volume).toBeNumber();
expectTypeOf(mySound.walls).toBeBoolean();
expectTypeOf(mySound.easing).toBeBoolean();
expectTypeOf(mySound.hidden).toBeBoolean();
expectTypeOf(mySound.darkness.min).toBeNumber();
expectTypeOf(mySound.darkness.max).toBeNumber();
expectTypeOf(mySound.effects.base.type).toEqualTypeOf<string | undefined>();
expectTypeOf(mySound.effects.base.intensity).toEqualTypeOf<number | null>();
expectTypeOf(mySound.effects.muffled.type).toEqualTypeOf<string | undefined>();
expectTypeOf(mySound.effects.muffled.intensity).toEqualTypeOf<number | null>();
expectTypeOf(mySound.flags).toEqualTypeOf<InterfaceToObject<Document.CoreFlags>>();
