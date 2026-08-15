import { afterAll, describe, expect, expectTypeOf, test } from "vitest";

import Actors = foundry.documents.collections.Actors;

describe("Actors Tests", async () => {
  const docsToCleanUp = new Set<foundry.abstract.Document.AnyStored>();

  const actor = await Actor.implementation.create({ name: "Actors Collection Test Actor", type: "base" });
  if (!actor) throw new Error("Failed to create test Actor.");
  docsToCleanUp.add(actor);

  const actorSource: Actor.Source = actor.toObject();
  const actorImpl = new Actor.implementation({ name: "Actors Collection Test Actor", type: "base" });

  const item = await Item.implementation.create({ name: "Actors Collection Test Item", type: "base" });
  if (!item) throw new Error("Failed to create test Item.");
  docsToCleanUp.add(item);

  const itemSource: Item.Source = item.toObject();

  const falseOrUndefined: false | undefined = Math.random() > 0.5 ? false : undefined;
  const trueOrUndefined: true | undefined = Math.random() > 0.5 ? true : undefined;
  const boolOrUndefined: boolean | undefined = Math.random() > 0.66 ? true : Math.random() > 0.5 ? false : undefined;

  test("Construction", () => {
    new CONFIG.Actor.collection();
    new Actors([actorSource]);

    // @ts-expect-error Item data not assignable to Actor data
    new Actors([itemSource]);
  });

  const actors = new Actors([actorSource]);

  test("Inheritance", () => {
    expectTypeOf(actors).toExtend<Collection.Any>();
    expectTypeOf(Actors).toExtend<Collection.AnyConstructor>();
    expect(actors).toBeInstanceOf(Collection);
    expectTypeOf(actors).toExtend<foundry.documents.abstract.DocumentCollection.Any>();
    expectTypeOf(Actors).toExtend<foundry.documents.abstract.DocumentCollection.AnyConstructor>();
    expect(actors).toBeInstanceOf(foundry.documents.abstract.DocumentCollection);
    expectTypeOf(actors).toExtend<foundry.documents.abstract.WorldCollection.Any>();
    expectTypeOf(Actors).toExtend<foundry.documents.abstract.WorldCollection.AnyConstructor>();
    expect(actors).toBeInstanceOf(foundry.documents.abstract.WorldCollection);
  });

  test("Miscellaneous", () => {
    expectTypeOf(Actors.documentName).toEqualTypeOf<"Actor">();
    expectTypeOf(Actors.instance).toEqualTypeOf<Actors.Implementation>();
    expectTypeOf(actors.folders).toEqualTypeOf<Collection<Folder.Stored<"Actor">>>();
    expectTypeOf(actors.directory).toEqualTypeOf<typeof ui.actors>();

    expectTypeOf(actors.tokens).toEqualTypeOf<Record<string, Actor.Stored>>();
  });

  test("Getting", () => {
    expectTypeOf(actors.get("ID")).toEqualTypeOf<Actor.Stored | undefined>();
    expectTypeOf(actors.get("ID", {})).toEqualTypeOf<Actor.Stored | undefined>();
    expectTypeOf(actors.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Actor.Stored | undefined>();
    expectTypeOf(actors.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Actor.Invalid | Actor.Stored>();
    expectTypeOf(actors.get("ID", { invalid: undefined, strict: undefined })).toEqualTypeOf<Actor.Stored | undefined>();

    // testing `invalid` (defaults `false`, preventing `.Invalid`s)
    expectTypeOf(actors.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Actor.Invalid | Actor.Stored>();
    expectTypeOf(actors.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Actor.Stored>();
    expectTypeOf(actors.get("ID", { invalid: undefined, strict: true })).toEqualTypeOf<Actor.Stored>();
    expectTypeOf(actors.get("ID", { invalid: falseOrUndefined, strict: true })).toEqualTypeOf<Actor.Stored>();
    expectTypeOf(actors.get("ID", { invalid: boolOrUndefined, strict: true })).toEqualTypeOf<
      Actor.Invalid | Actor.Stored
    >();
    expectTypeOf(actors.get("ID", { invalid: trueOrUndefined, strict: true })).toEqualTypeOf<
      Actor.Invalid | Actor.Stored
    >();

    // testing `strict` (defaults `false`, allowing `undefined`)
    expectTypeOf(actors.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Actor.Stored>();
    expectTypeOf(actors.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Actor.Stored | undefined>();
    expectTypeOf(actors.get("ID", { invalid: false, strict: undefined })).toEqualTypeOf<Actor.Stored | undefined>();
    expectTypeOf(actors.get("ID", { invalid: false, strict: falseOrUndefined })).toEqualTypeOf<
      Actor.Stored | undefined
    >();
    expectTypeOf(actors.get("ID", { invalid: false, strict: boolOrUndefined })).toEqualTypeOf<
      Actor.Stored | undefined
    >();
    expectTypeOf(actors.get("ID", { invalid: false, strict: trueOrUndefined })).toEqualTypeOf<
      Actor.Stored | undefined
    >();

    expectTypeOf(actors.getInvalid("ID")).toEqualTypeOf<Actor.Invalid>();
    expectTypeOf(actors.getInvalid("ID", {})).toEqualTypeOf<Actor.Invalid>();
    expectTypeOf(actors.getInvalid("ID", { strict: false })).toEqualTypeOf<Actor.Invalid | undefined>();
    expectTypeOf(actors.getInvalid("ID", { strict: undefined })).toEqualTypeOf<Actor.Invalid>();
    expectTypeOf(actors.getInvalid("ID", { strict: trueOrUndefined })).toEqualTypeOf<Actor.Invalid>();
    expectTypeOf(actors.getInvalid("ID", { strict: falseOrUndefined })).toEqualTypeOf<Actor.Invalid | undefined>();
    expectTypeOf(actors.getInvalid("ID", { strict: boolOrUndefined })).toEqualTypeOf<Actor.Invalid | undefined>();

    expectTypeOf(actors.getName("name")).toEqualTypeOf<Actor.Stored | undefined>();
    expectTypeOf(actors.getName("name", {})).toEqualTypeOf<Actor.Stored | undefined>();
    expectTypeOf(actors.getName("name", { strict: true })).toEqualTypeOf<Actor.Stored>();
    expectTypeOf(actors.getName("name", { strict: undefined })).toEqualTypeOf<Actor.Stored | undefined>();
    expectTypeOf(actors.getName("name", { strict: trueOrUndefined })).toEqualTypeOf<Actor.Stored | undefined>();
    expectTypeOf(actors.getName("name", { strict: falseOrUndefined })).toEqualTypeOf<Actor.Stored | undefined>();
    expectTypeOf(actors.getName("name", { strict: boolOrUndefined })).toEqualTypeOf<Actor.Stored | undefined>();
  });

  test("importDocument fake override", async () => {
    // Passing a doc with no subtype data gets back a `Stored` without any either
    const imported1 = await actors.importDocument(actor, {});
    if (!imported1) throw new Error("Failed to create test `Actor` via `#importDocument`");
    docsToCleanUp.add(imported1);
    expectTypeOf(imported1).toEqualTypeOf<Actor.Stored>();

    // Passing a doc with subtype info preserves it
    const imported2 = await actors.importDocument(actorImpl, {});
    if (!imported2) throw new Error("Failed to create test `Actor` via `#importDocument`");
    docsToCleanUp.add(imported2);
    expectTypeOf(imported2).toEqualTypeOf<Actor.Stored<"base">>();
  });

  test("_prepareImportDocument", () => {
    // @ts-expect-error _prepareImportDocument will throw if not passed an object for `options`, because it lacks a signature default.
    expect(() => actors["_prepareImportDocument"](actor)).toThrow();

    expectTypeOf(actors["_prepareImportDocument"](actorImpl, {})).toEqualTypeOf<
      Omit<Actor.Source, "sort" | "navOrder" | "active" | "_id">
    >();

    // testing the FromCompendiumReturnType
    expectTypeOf(actors["_prepareImportDocument"](actor, { keepId: true })).toEqualTypeOf<
      Omit<Actor.Source, "sort" | "navOrder" | "active">
    >();
    expectTypeOf(actors["_prepareImportDocument"](actorImpl, { clearFolder: true })).toEqualTypeOf<
      Omit<Actor.Source, "sort" | "navOrder" | "active" | "_id" | "folder">
    >();

    // also testing CreateDocumentsOperation
    expectTypeOf(
      actors["_prepareImportDocument"](actorImpl, {
        clearFolder: true,
        noHook: false,
        renderSheet: true,
        documentName: "Actor", // This should error until we update db ops, but excess properties are not being errored on here for some reason
      }),
    ).toEqualTypeOf<Omit<Actor.Source, "sort" | "navOrder" | "active" | "_id" | "folder">>();
  });

  test("Setting and Deleting", () => {
    // @ts-expect-error `DocumentCollection`s only contain stored documents
    actors.set("ID", actorImpl);
    // @ts-expect-error `Item`s are not `Actor`s
    actors.set("ID", item);

    expectTypeOf(actors.set("ID", actor)).toEqualTypeOf<typeof actors>();

    expectTypeOf(actors.delete("ID")).toBeBoolean();
  });

  afterAll(async () => {
    for (const doc of docsToCleanUp) await doc.delete();
  });
});
