import { describe, expectTypeOf, test } from "vitest";

import Items = foundry.documents.collections.Items;

declare const itemCreateData: Item.CreateData;
declare const itemSource: Item.Source;
declare const item: Item.Stored;
declare const itemImpl: Item.Implementation;
declare const actorCreateData: Actor.CreateData;
declare const actor: Actor.Stored;
declare const falseOrUndefined: false | undefined;
declare const trueOrUndefined: true | undefined;
declare const boolOrUndefined: boolean | undefined;

describe("Items Tests", () => {
  test("Construction", () => {
    new Items();
    new Items([itemCreateData]);
    new Items([itemSource]);

    // @ts-expect-error `Actor` data not assignable to `Item` data
    new Items([actorCreateData]);
  });

  const items = new Items([itemCreateData]);

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
    // returns void, for now (13.350): https://github.com/foundryvtt/foundryvtt/issues/13565
    expectTypeOf(items.set("ID", item)).toBeVoid();

    expectTypeOf(items.delete("ID")).toBeBoolean();
  });
});
