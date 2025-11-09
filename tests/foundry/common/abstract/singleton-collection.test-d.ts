import { describe, expectTypeOf, test } from "vitest";

import SingletonEmbeddedCollection from "#common/abstract/singleton-collection.mjs";

declare const deltaSource: ActorDelta.Source;
declare const deltaCreateData: ActorDelta.CreateData;
declare const tokenDoc: TokenDocument.Stored;
declare const deltaStored: ActorDelta.Stored;
declare const falseOrUndefined: false | undefined;
declare const trueOrUndefined: true | undefined;
declare const boolOrUndefined: boolean | undefined;

declare const actorInvalid: Actor.Invalid;
const _x: Item.Invalid = actorInvalid;

describe("SingletonEmbeddedCollection Tests", () => {
  test("Construction", () => {
    new SingletonEmbeddedCollection<ActorDelta.Stored, TokenDocument.Stored>("delta", tokenDoc, [deltaSource]);
    new SingletonEmbeddedCollection<ActorDelta.Stored, TokenDocument.Stored>("delta", tokenDoc, [deltaCreateData]);
  });

  const sec = new SingletonEmbeddedCollection<ActorDelta.Stored, TokenDocument.Stored>("delta", tokenDoc, [
    deltaSource,
  ]);

  test("Getting", () => {
    expectTypeOf(sec.get("ID")).toEqualTypeOf<ActorDelta.Stored | undefined>();
    expectTypeOf(sec.get("ID", {})).toEqualTypeOf<ActorDelta.Stored | undefined>();
    expectTypeOf(sec.get("ID", { invalid: false, strict: false })).toEqualTypeOf<ActorDelta.Stored | undefined>();
    expectTypeOf(sec.get("ID", { invalid: true, strict: true })).toEqualTypeOf<
      ActorDelta.Invalid | ActorDelta.Stored
    >();
    expectTypeOf(sec.get("ID", { invalid: undefined, strict: undefined })).toEqualTypeOf<
      ActorDelta.Stored | undefined
    >();

    // testing `invalid` (defaults `false`, preventing `.Invalid`s)
    expectTypeOf(sec.get("ID", { invalid: true, strict: true })).toEqualTypeOf<
      ActorDelta.Invalid | ActorDelta.Stored
    >();
    expectTypeOf(sec.get("ID", { invalid: false, strict: true })).toEqualTypeOf<ActorDelta.Stored>();
    expectTypeOf(sec.get("ID", { invalid: undefined, strict: true })).toEqualTypeOf<ActorDelta.Stored>();
    expectTypeOf(sec.get("ID", { invalid: falseOrUndefined, strict: true })).toEqualTypeOf<ActorDelta.Stored>();
    expectTypeOf(sec.get("ID", { invalid: boolOrUndefined, strict: true })).toEqualTypeOf<
      ActorDelta.Invalid | ActorDelta.Stored
    >();
    expectTypeOf(sec.get("ID", { invalid: trueOrUndefined, strict: true })).toEqualTypeOf<
      ActorDelta.Invalid | ActorDelta.Stored
    >();

    // testing `strict` (defaults `false`, allowing `undefined`)
    expectTypeOf(sec.get("ID", { invalid: false, strict: true })).toEqualTypeOf<ActorDelta.Stored>();
    expectTypeOf(sec.get("ID", { invalid: false, strict: false })).toEqualTypeOf<ActorDelta.Stored | undefined>();
    expectTypeOf(sec.get("ID", { invalid: false, strict: undefined })).toEqualTypeOf<ActorDelta.Stored | undefined>();
    expectTypeOf(sec.get("ID", { invalid: false, strict: falseOrUndefined })).toEqualTypeOf<
      ActorDelta.Stored | undefined
    >();
    expectTypeOf(sec.get("ID", { invalid: false, strict: boolOrUndefined })).toEqualTypeOf<
      ActorDelta.Stored | undefined
    >();
    expectTypeOf(sec.get("ID", { invalid: false, strict: trueOrUndefined })).toEqualTypeOf<
      ActorDelta.Stored | undefined
    >();

    expectTypeOf(sec.getInvalid("ID")).toEqualTypeOf<ActorDelta.Invalid>();
    expectTypeOf(sec.getInvalid("ID", {})).toEqualTypeOf<ActorDelta.Invalid>();
    expectTypeOf(sec.getInvalid("ID", { strict: false })).toEqualTypeOf<ActorDelta.Invalid | undefined>();
    expectTypeOf(sec.getInvalid("ID", { strict: undefined })).toEqualTypeOf<ActorDelta.Invalid>();
    expectTypeOf(sec.getInvalid("ID", { strict: trueOrUndefined })).toEqualTypeOf<ActorDelta.Invalid>();
    expectTypeOf(sec.getInvalid("ID", { strict: falseOrUndefined })).toEqualTypeOf<ActorDelta.Invalid | undefined>();
    expectTypeOf(sec.getInvalid("ID", { strict: boolOrUndefined })).toEqualTypeOf<ActorDelta.Invalid | undefined>();
  });

  test("Setting", () => {
    expectTypeOf(sec.set("ID", deltaStored)).toEqualTypeOf<typeof sec>();
    expectTypeOf(sec.set("ID", deltaStored, {})).toEqualTypeOf<typeof sec>();
    expectTypeOf(sec.set("ID", deltaStored, { modifySource: false })).toEqualTypeOf<typeof sec>();
    expectTypeOf(sec.set("ID", deltaStored, { modifySource: undefined })).toEqualTypeOf<typeof sec>();

    expectTypeOf(sec["_set"]("ID", deltaStored)).toBeVoid();
  });

  test("Deleting", () => {
    expectTypeOf(sec["_delete"]("ID")).toBeVoid();
  });
});
