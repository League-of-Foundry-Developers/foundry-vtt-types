import { expectTypeOf } from "vitest";

expectTypeOf(new foundry.documents.BaseAmbientSound()).toEqualTypeOf<foundry.documents.BaseAmbientSound>();
expectTypeOf(new foundry.documents.BaseAmbientSound({})).toEqualTypeOf<foundry.documents.BaseAmbientSound>();
expectTypeOf(
  new foundry.documents.BaseAmbientSound({
    _id: null,
    x: 10,
    y: 10,
    hidden: true,
    radius: 100,
    darkness: { min: 10, max: 90 },
    easing: true,
    path: "path/to/file",
    repeat: true,
    volume: 100,
  }),
).toEqualTypeOf<foundry.documents.BaseAmbientSound>();
expectTypeOf(
  new foundry.documents.BaseAmbientSound({
    _id: null,
    x: null,
    y: null,
    hidden: null,
    radius: null,
    darkness: null, // FIXME: This is valid
    easing: null,
    path: null,
    repeat: null,
    volume: null,
  }),
).toEqualTypeOf<foundry.documents.BaseAmbientSound>();
expectTypeOf(
  new foundry.documents.BaseAmbientSound({
    _id: undefined,
    x: undefined,
    y: undefined,
    hidden: undefined,
    radius: undefined,
    darkness: undefined, // FIXME: This is valid
    easing: undefined,
    path: undefined,
    repeat: undefined,
    volume: undefined,
  }),
).toEqualTypeOf<foundry.documents.BaseAmbientSound>();
