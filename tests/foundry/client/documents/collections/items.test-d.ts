import { afterAll, describe, expectTypeOf, test } from "vitest";

import Items = foundry.documents.collections.Items;

describe("Items Tests", async () => {
  const docsToCleanUp = new Set<foundry.abstract.Document.AnyStored>();

  const item = await Item.implementation.create({
    name: "Items Collection Test Item",
    type: "base",
  });
  if (!item) throw new Error("Failed to create test Item.");
  docsToCleanUp.add(item);

  const itemSource = item.toObject();
  const itemImpl = new Item.implementation({
    name: "Items Collection Test Item",
    type: "base",
  });

  const actor = await Actor.implementation.create({
    name: "Items Collection Test Actor",
    type: "base",
  });
  if (!actor) throw new Error("Failed to create test Actor.");
  docsToCleanUp.add(actor);

  const actorSource = actor.toObject();

  const falseOrUndefined: false | undefined = Math.random() > 0.5 ? false : undefined;
  const trueOrUndefined: true | undefined = Math.random() > 0.5 ? true : undefined;
  const boolOrUndefined: boolean | undefined = Math.random() > 0.66 ? true : Math.random() > 0.5 ? false : undefined;

  test("Construction", () => {
    new Items();
    new Items([itemSource]);

    // @ts-expect-error `Actor` data not assignable to `Item` data
    new Items([actorSource]);
  });

  const items = new Items([itemSource]);

  test("Miscellaneous", () => {
    expectTypeOf(Items.documentName).toEqualTypeOf<"Item">();
    expectTypeOf(Items.instance).toEqualTypeOf<Items.Implementation>();
    expectTypeOf(items.folders).toEqualTypeOf<Collection<Folder.Stored<"Item">>>();
    expectTypeOf(items.directory).toEqualTypeOf<typeof ui.items>();
  });

  test("Getting", () => {
    expectTypeOf(items.get("ID")).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(items.get("ID", {})).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(items.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(items.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Item.Invalid | Item.Stored>();
    expectTypeOf(items.get("ID", { invalid: undefined, strict: undefined })).toEqualTypeOf<Item.Stored | undefined>();

    // testing `invalid` (defaults `false`, preventing `.Invalid`s)
    expectTypeOf(items.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Item.Invalid | Item.Stored>();
    expectTypeOf(items.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Item.Stored>();
    expectTypeOf(items.get("ID", { invalid: undefined, strict: true })).toEqualTypeOf<Item.Stored>();
    expectTypeOf(items.get("ID", { invalid: falseOrUndefined, strict: true })).toEqualTypeOf<Item.Stored>();
    expectTypeOf(items.get("ID", { invalid: boolOrUndefined, strict: true })).toEqualTypeOf<
      Item.Invalid | Item.Stored
    >();
    expectTypeOf(items.get("ID", { invalid: trueOrUndefined, strict: true })).toEqualTypeOf<
      Item.Invalid | Item.Stored
    >();

    // testing `strict` (defaults `false`, allowing `undefined`)
    expectTypeOf(items.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Item.Stored>();
    expectTypeOf(items.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(items.get("ID", { invalid: false, strict: undefined })).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(items.get("ID", { invalid: false, strict: falseOrUndefined })).toEqualTypeOf<
      Item.Stored | undefined
    >();
    expectTypeOf(items.get("ID", { invalid: false, strict: boolOrUndefined })).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(items.get("ID", { invalid: false, strict: trueOrUndefined })).toEqualTypeOf<Item.Stored | undefined>();

    expectTypeOf(items.getInvalid("ID")).toEqualTypeOf<Item.Invalid>();
    expectTypeOf(items.getInvalid("ID", {})).toEqualTypeOf<Item.Invalid>();
    expectTypeOf(items.getInvalid("ID", { strict: false })).toEqualTypeOf<Item.Invalid | undefined>();
    expectTypeOf(items.getInvalid("ID", { strict: undefined })).toEqualTypeOf<Item.Invalid>();
    expectTypeOf(items.getInvalid("ID", { strict: trueOrUndefined })).toEqualTypeOf<Item.Invalid>();
    expectTypeOf(items.getInvalid("ID", { strict: falseOrUndefined })).toEqualTypeOf<Item.Invalid | undefined>();
    expectTypeOf(items.getInvalid("ID", { strict: boolOrUndefined })).toEqualTypeOf<Item.Invalid | undefined>();

    expectTypeOf(items.getName("name")).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(items.getName("name", {})).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(items.getName("name", { strict: true })).toEqualTypeOf<Item.Stored>();
    expectTypeOf(items.getName("name", { strict: undefined })).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(items.getName("name", { strict: trueOrUndefined })).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(items.getName("name", { strict: falseOrUndefined })).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(items.getName("name", { strict: boolOrUndefined })).toEqualTypeOf<Item.Stored | undefined>();
  });

  test("Setting and Deleting", () => {
    // @ts-expect-error `DocumentCollection`s only contain stored documents
    items.set("ID", itemImpl);
    // @ts-expect-error `Actor`s are not `Item`s
    items.set("ID", actor);
    // returns void, for now (13.351): https://github.com/foundryvtt/foundryvtt/issues/13565
    expectTypeOf(items.set("ID", item)).toBeVoid();

    expectTypeOf(items.delete("ID")).toBeBoolean();
  });

  afterAll(async () => {
    for (const doc of docsToCleanUp) await doc.delete();
  });
});
