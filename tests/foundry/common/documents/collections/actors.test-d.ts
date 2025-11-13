import { describe, expectTypeOf, test } from "vitest";

import Actors = foundry.documents.collections.Actors;

declare const actorCreateData: Actor.CreateData;
declare const actorSource: Actor.Source;
declare const itemCreateData: Item.CreateData;
declare const actor: Actor.Stored;
declare const item: Item.Stored;

describe("Actors Tests", () => {
  test("Construction", () => {
    new Actors();
    new Actors([actorCreateData]);
    new Actors([actorSource]);

    // @ts-expect-error Item data not assignable to Actor data
    new Actors([itemCreateData]);
  });

  const actors = new Actors([actorCreateData]);

  test("Miscellaneous", () => {
    expectTypeOf(Actors.documentName).toEqualTypeOf<"Actor">();
    expectTypeOf(Actors.instance).toEqualTypeOf<Actors.Implementation>();

    expectTypeOf(actors.tokens).toEqualTypeOf<Record<string, Actor.Stored>>();
  });

  test("fromCompendium", () => {
    // no deletions with these options
    expectTypeOf(
      actors.fromCompendium(actor, {
        clearFolder: false,
        clearOwnership: false,
        clearSort: false,
        clearState: false,
        keepId: true,
      }),
    ).toEqualTypeOf<Actor.Source>();

    // clearFolder only
    expectTypeOf(
      actors.fromCompendium(actor, {
        clearFolder: true,
        clearOwnership: false,
        clearSort: false,
        clearState: false,
        keepId: true,
      }),
    ).toEqualTypeOf<Omit<Actor.Source, "folder">>();

    // clearOwnership only
    expectTypeOf(
      actors.fromCompendium(actor, {
        clearFolder: false,
        clearOwnership: true,
        clearSort: false,
        clearState: false,
        keepId: true,
      }),
    ).toEqualTypeOf<Omit<Actor.Source, "ownership">>();

    // clearSort only - Actors don't have `navOrder`, so its irrelevant that it's omitted
    expectTypeOf(
      actors.fromCompendium(actor, {
        clearFolder: false,
        clearOwnership: false,
        clearSort: true,
        clearState: false,
        keepId: true,
      }),
    ).toEqualTypeOf<Omit<Actor.Source, "sort">>();

    // clearState only - Actors don't have 'active', so its irrelevant that it's omitted
    expectTypeOf(
      actors.fromCompendium(actor, {
        clearFolder: false,
        clearOwnership: false,
        clearSort: false,
        clearState: true,
        keepId: true,
      }),
    ).toEqualTypeOf<Actor.Source>();

    // keepId only
    expectTypeOf(
      actors.fromCompendium(actor, {
        clearFolder: false,
        clearOwnership: false,
        clearSort: false,
        clearState: false,
        keepId: false,
      }),
    ).toEqualTypeOf<Omit<Actor.Source, "_id">>();

    // everything
    expectTypeOf(
      actors.fromCompendium(actor, {
        clearFolder: true,
        clearOwnership: true,
        clearSort: true,
        clearState: true,
        keepId: false,
      }),
    ).toEqualTypeOf<Omit<Actor.Source, "_id" | "sort" | "ownership" | "folder">>();

    // default case - all deletions enabled except `folder`
    expectTypeOf(actors.fromCompendium(actor)).toEqualTypeOf<Omit<Actor.Source, "_id" | "sort" | "ownership">>();
    expectTypeOf(actors.fromCompendium(actor, {})).toEqualTypeOf<Omit<Actor.Source, "_id" | "sort" | "ownership">>();
    expectTypeOf(
      actors.fromCompendium(actor, {
        clearFolder: undefined,
        clearOwnership: undefined,
        clearSort: undefined,
        clearState: undefined,
        keepId: undefined,
      }),
    ).toEqualTypeOf<Omit<Actor.Source, "_id" | "sort" | "ownership">>();

    // @ts-expect-error `Item.Stored`s aren't `Actor.Stored`s
    actors.fromCompendium(item);
  });
});
