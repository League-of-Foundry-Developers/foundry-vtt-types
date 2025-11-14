import { describe, expectTypeOf, test } from "vitest";

import FogExplorations = foundry.documents.collections.FogExplorations;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;

declare const fogCreateData: FogExploration.CreateData;
declare const fogSource: FogExploration.Source;
declare const stack: FogExploration.Stored;
declare const fogImpl: FogExploration.Implementation;
declare const actor: Actor.Stored;
declare const wallCreateData: WallDocument.CreateData;
declare const falseOrUndefined: false | undefined;
declare const trueOrUndefined: true | undefined;
declare const boolOrUndefined: boolean | undefined;

describe("FogExplorations Tests", () => {
  test("Construction", () => {
    new FogExplorations();
    new FogExplorations([fogCreateData]);
    new FogExplorations([fogSource]);

    // This errors in most other world collections, but `FogExploration` has *nothing* required in its `CreateData`
    new FogExplorations([wallCreateData]);
  });

  const fogs = new FogExplorations([fogCreateData]);

  test("Miscellaneous", () => {
    expectTypeOf(FogExplorations.documentName).toEqualTypeOf<"FogExploration">();
    expectTypeOf(FogExplorations.instance).toEqualTypeOf<FogExplorations.Implementation>();
    expectTypeOf(fogs.folders).toEqualTypeOf<Collection<never>>();
    expectTypeOf(fogs.directory).toEqualTypeOf<DocumentDirectory<FogExploration.ImplementationClass> | undefined>();
    expectTypeOf(fogs.name).toEqualTypeOf<"FogExplorations">();

    expectTypeOf(FogExplorations._activateSocketListeners(game.socket!)).toBeVoid();
  });

  test("Getting", () => {
    expectTypeOf(fogs.get("ID")).toEqualTypeOf<FogExploration.Stored | undefined>();
    expectTypeOf(fogs.get("ID", {})).toEqualTypeOf<FogExploration.Stored | undefined>();
    expectTypeOf(fogs.get("ID", { invalid: false, strict: false })).toEqualTypeOf<FogExploration.Stored | undefined>();
    expectTypeOf(fogs.get("ID", { invalid: true, strict: true })).toEqualTypeOf<
      FogExploration.Invalid | FogExploration.Stored
    >();
    expectTypeOf(fogs.get("ID", { invalid: undefined, strict: undefined })).toEqualTypeOf<
      FogExploration.Stored | undefined
    >();

    // testing `invalid` (defaults `false`, preventing `.Invalid`s)
    expectTypeOf(fogs.get("ID", { invalid: true, strict: true })).toEqualTypeOf<
      FogExploration.Invalid | FogExploration.Stored
    >();
    expectTypeOf(fogs.get("ID", { invalid: false, strict: true })).toEqualTypeOf<FogExploration.Stored>();
    expectTypeOf(fogs.get("ID", { invalid: undefined, strict: true })).toEqualTypeOf<FogExploration.Stored>();
    expectTypeOf(fogs.get("ID", { invalid: falseOrUndefined, strict: true })).toEqualTypeOf<FogExploration.Stored>();
    expectTypeOf(fogs.get("ID", { invalid: boolOrUndefined, strict: true })).toEqualTypeOf<
      FogExploration.Invalid | FogExploration.Stored
    >();
    expectTypeOf(fogs.get("ID", { invalid: trueOrUndefined, strict: true })).toEqualTypeOf<
      FogExploration.Invalid | FogExploration.Stored
    >();

    // testing `strict` (defaults `false`, allowing `undefined`)
    expectTypeOf(fogs.get("ID", { invalid: false, strict: true })).toEqualTypeOf<FogExploration.Stored>();
    expectTypeOf(fogs.get("ID", { invalid: false, strict: false })).toEqualTypeOf<FogExploration.Stored | undefined>();
    expectTypeOf(fogs.get("ID", { invalid: false, strict: undefined })).toEqualTypeOf<
      FogExploration.Stored | undefined
    >();
    expectTypeOf(fogs.get("ID", { invalid: false, strict: falseOrUndefined })).toEqualTypeOf<
      FogExploration.Stored | undefined
    >();
    expectTypeOf(fogs.get("ID", { invalid: false, strict: boolOrUndefined })).toEqualTypeOf<
      FogExploration.Stored | undefined
    >();
    expectTypeOf(fogs.get("ID", { invalid: false, strict: trueOrUndefined })).toEqualTypeOf<
      FogExploration.Stored | undefined
    >();

    expectTypeOf(fogs.getInvalid("ID")).toEqualTypeOf<FogExploration.Invalid>();
    expectTypeOf(fogs.getInvalid("ID", {})).toEqualTypeOf<FogExploration.Invalid>();
    expectTypeOf(fogs.getInvalid("ID", { strict: false })).toEqualTypeOf<FogExploration.Invalid | undefined>();
    expectTypeOf(fogs.getInvalid("ID", { strict: undefined })).toEqualTypeOf<FogExploration.Invalid>();
    expectTypeOf(fogs.getInvalid("ID", { strict: trueOrUndefined })).toEqualTypeOf<FogExploration.Invalid>();
    expectTypeOf(fogs.getInvalid("ID", { strict: falseOrUndefined })).toEqualTypeOf<
      FogExploration.Invalid | undefined
    >();
    expectTypeOf(fogs.getInvalid("ID", { strict: boolOrUndefined })).toEqualTypeOf<
      FogExploration.Invalid | undefined
    >();

    expectTypeOf(fogs.getName("name")).toEqualTypeOf<FogExploration.Stored | undefined>();
    expectTypeOf(fogs.getName("name", {})).toEqualTypeOf<FogExploration.Stored | undefined>();
    expectTypeOf(fogs.getName("name", { strict: true })).toEqualTypeOf<FogExploration.Stored>();
    expectTypeOf(fogs.getName("name", { strict: undefined })).toEqualTypeOf<FogExploration.Stored | undefined>();
    expectTypeOf(fogs.getName("name", { strict: trueOrUndefined })).toEqualTypeOf<FogExploration.Stored | undefined>();
    expectTypeOf(fogs.getName("name", { strict: falseOrUndefined })).toEqualTypeOf<FogExploration.Stored | undefined>();
    expectTypeOf(fogs.getName("name", { strict: boolOrUndefined })).toEqualTypeOf<FogExploration.Stored | undefined>();
  });

  test("Setting and Deleting", () => {
    // @ts-expect-error `DocumentCollection`s only contain stored documents
    fogs.set("ID", fogImpl);
    // @ts-expect-error `Actor`s are not `FogExploration`s
    fogs.set("ID", actor);
    // returns void, for now (13.350): https://github.com/foundryvtt/foundryvtt/issues/13565
    expectTypeOf(fogs.set("ID", stack)).toBeVoid();

    expectTypeOf(fogs.delete("ID")).toBeBoolean();
  });
});
