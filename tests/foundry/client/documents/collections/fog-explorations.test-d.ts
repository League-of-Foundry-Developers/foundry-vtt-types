import { afterAll, describe, expectTypeOf, test } from "vitest";

import FogExplorations = foundry.documents.collections.FogExplorations;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;

describe("FogExplorations Tests", async () => {
  const docsToCleanUp = new Set<foundry.abstract.Document.AnyStored>();

  const fog = await FogExploration.implementation.create({});
  if (!fog) throw new Error("Failed to create test FogExploration.");
  docsToCleanUp.add(fog);

  const fogSource = fog.toObject();
  const fogImpl = new FogExploration.implementation();

  const actor = await Actor.implementation.create({
    name: "FogExplorations Collection Test Actor",
    type: "base",
  });
  if (!actor) throw new Error("Failed to create test Actor.");
  docsToCleanUp.add(actor);

  const actorSource = actor.toObject();

  const falseOrUndefined: false | undefined = Math.random() > 0.5 ? false : undefined;
  const trueOrUndefined: true | undefined = Math.random() > 0.5 ? true : undefined;
  const boolOrUndefined: boolean | undefined = Math.random() > 0.66 ? true : Math.random() > 0.5 ? false : undefined;

  test("Construction", () => {
    new FogExplorations();
    new FogExplorations([fogSource]);

    // @ts-expect-error `Actor`s are not `FogExploration`s
    new FogExplorations([actorSource]);
  });

  const fogs = new FogExplorations([fogSource]);

  test("Miscellaneous", () => {
    expectTypeOf(FogExplorations.documentName).toEqualTypeOf<"FogExploration">();
    expectTypeOf(FogExplorations.instance).toEqualTypeOf<FogExplorations.Implementation>();
    expectTypeOf(fogs.folders).toEqualTypeOf<Collection<never>>();
    expectTypeOf(fogs.directory).toEqualTypeOf<DocumentDirectory<FogExploration.ImplementationClass> | undefined>();

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
    // returns void, for now (13.351): https://github.com/foundryvtt/foundryvtt/issues/13565
    expectTypeOf(fogs.set("ID", fog)).toBeVoid();

    expectTypeOf(fogs.delete("ID")).toBeBoolean();
  });

  afterAll(async () => {
    for (const doc of docsToCleanUp) await doc.delete();
  });
});
