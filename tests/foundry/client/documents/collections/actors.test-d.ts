import { afterAll, describe, expectTypeOf, test } from "vitest";

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

  test("Miscellaneous", () => {
    expectTypeOf(Actors.documentName).toEqualTypeOf<"Actor">();
    expectTypeOf(Actors.instance).toEqualTypeOf<Actors.Implementation>();
    expectTypeOf(actors.folders).toEqualTypeOf<Collection<Folder.Stored<"Actor">>>();
    expectTypeOf(actors.directory).toEqualTypeOf<typeof ui.actors>();

    expectTypeOf(actors.tokens).toEqualTypeOf<Record<string, Actor.Stored>>();
  });

  test("fromCompendium", () => {
    const actorOrSource: Actor.Stored | Actor.Source = actorSource;

    // no deletions with these options
    expectTypeOf(
      actors.fromCompendium(actorOrSource, {
        clearFolder: false,
        clearOwnership: false,
        clearSort: false,
        clearState: false,
        keepId: true,
      }),
    ).toEqualTypeOf<Actor.Source>();

    // more thorough options testing is in the `WorldCollection` tests

    // default case - all deletions enabled except `folder`
    expectTypeOf(actors.fromCompendium(actorOrSource)).toEqualTypeOf<
      Omit<Actor.Source, "_id" | "sort" | "ownership">
    >();
    expectTypeOf(actors.fromCompendium(actorOrSource, {})).toEqualTypeOf<
      Omit<Actor.Source, "_id" | "sort" | "ownership">
    >();
    expectTypeOf(
      actors.fromCompendium(actorOrSource, {
        clearFolder: undefined,
        clearOwnership: undefined,
        clearSort: undefined,
        clearState: undefined,
        keepId: undefined,
      }),
    ).toEqualTypeOf<Omit<Actor.Source, "_id" | "sort" | "ownership">>();

    // @ts-expect-error `Actor.Stored`s aren't `Actor.Stored`s
    actors.fromCompendium(item);
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

  test("Setting and Deleting", () => {
    // @ts-expect-error `DocumentCollection`s only contain stored documents
    actors.set("ID", actorImpl);
    // @ts-expect-error `Item`s are not `Actor`s
    actors.set("ID", item);
    // returns void, for now (13.351): https://github.com/foundryvtt/foundryvtt/issues/13565
    expectTypeOf(actors.set("ID", actor)).toBeVoid();

    expectTypeOf(actors.delete("ID")).toBeBoolean();
  });

  afterAll(async () => {
    for (const doc of docsToCleanUp) await doc.delete();
  });
});
