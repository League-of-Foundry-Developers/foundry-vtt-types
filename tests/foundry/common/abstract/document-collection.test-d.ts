import { test, describe, expectTypeOf } from "vitest";

import DocumentCollection = foundry.documents.abstract.DocumentCollection;
import SearchFilter = foundry.applications.ux.SearchFilter;

declare const actor: Actor.Stored;
declare const itemSourceArray: Item.Source[];
declare const itemCreateDataArray: Item.CreateData[];
declare const itemMixedDataArray: (Item.Source | Item.CreateData)[];
declare const actorCreateDataArray: Actor.CreateData[];
declare const itemImpl: Item.Implementation;
declare const itemStored: Item.Stored;
declare const falseOrUndefined: false | undefined;
declare const trueOrUndefined: true | undefined;
declare const boolOrUndefined: boolean | undefined;

// DocumentCollection is abstract
class TestItemCollection extends DocumentCollection<"Item"> {}

describe("DocumentCollection Tests", () => {
  test("Construction", () => {
    // no data *needs* to be passed
    new TestItemCollection();

    // @ts-expect-error wrong document source type
    new TestItemCollection(actorCreateDataArray);

    // Source is assignable to CreateData, so either is accepted
    new TestItemCollection(itemSourceArray);
    new TestItemCollection(itemCreateDataArray);
    new TestItemCollection(itemMixedDataArray);
  });

  const dc = new TestItemCollection(itemCreateDataArray);

  test("Miscellaneous", () => {
    expectTypeOf(dc.documentClass).toEqualTypeOf<Item.ImplementationClass>();
    expectTypeOf(dc.documentName).toEqualTypeOf<"Item">();
    expectTypeOf(dc._source).toEqualTypeOf<Item.CreateData[]>();

    expectTypeOf(dc.createDocument(itemCreateDataArray[0]!)).toEqualTypeOf<Item.Implementation>();
    expectTypeOf(dc.createDocument(itemCreateDataArray[0]!, {})).toEqualTypeOf<Item.Implementation>();
    expectTypeOf(
      dc.createDocument(itemCreateDataArray[0]!, {
        dropInvalidEmbedded: true,
        fallback: false,
        // since this is returning a temporary document that doesn't automatically get put into the collection,
        // passing a parent is perfectly valid, although there's no reason to make this call in particular
        parent: actor,
      }),
    ).toEqualTypeOf<Item.Implementation>();

    expectTypeOf(dc.render()).toBeVoid();
    expectTypeOf(dc.render(true)).toBeVoid();
    expectTypeOf(dc.render(true, {})).toBeVoid();
    expectTypeOf(
      // random smattering of appv1 and appv2 render options
      dc.render(true, {
        classes: ["foo", "bar"],
        isFirstRender: false,
        title: "Title!",
        window: { title: "Title!" },
        position: { height: 500, width: 300 },
        height: 500,
        width: 300,
      }),
    ).toBeVoid();

    // @ts-expect-error `force` in the render options is always overwritten with the first arg, so we omit it
    dc.render(undefined, { force: true });
  });

  test("Getting", () => {
    expectTypeOf(dc.get("ID")).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(dc.get("ID", {})).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(dc.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(dc.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Item.Invalid | Item.Stored>();
    expectTypeOf(dc.get("ID", { invalid: undefined, strict: undefined })).toEqualTypeOf<Item.Stored | undefined>();

    // testing `invalid` (defaults `false`, preventing `.Invalid`s)
    expectTypeOf(dc.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Item.Invalid | Item.Stored>();
    expectTypeOf(dc.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Item.Stored>();
    expectTypeOf(dc.get("ID", { invalid: undefined, strict: true })).toEqualTypeOf<Item.Stored>();
    expectTypeOf(dc.get("ID", { invalid: falseOrUndefined, strict: true })).toEqualTypeOf<Item.Stored>();
    expectTypeOf(dc.get("ID", { invalid: boolOrUndefined, strict: true })).toEqualTypeOf<Item.Invalid | Item.Stored>();
    expectTypeOf(dc.get("ID", { invalid: trueOrUndefined, strict: true })).toEqualTypeOf<Item.Invalid | Item.Stored>();

    // testing `strict` (defaults `false`, allowing `undefined`)
    expectTypeOf(dc.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Item.Stored>();
    expectTypeOf(dc.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(dc.get("ID", { invalid: false, strict: undefined })).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(dc.get("ID", { invalid: false, strict: falseOrUndefined })).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(dc.get("ID", { invalid: false, strict: boolOrUndefined })).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(dc.get("ID", { invalid: false, strict: trueOrUndefined })).toEqualTypeOf<Item.Stored | undefined>();

    expectTypeOf(dc.getInvalid("ID")).toEqualTypeOf<Item.Invalid>();
    expectTypeOf(dc.getInvalid("ID", {})).toEqualTypeOf<Item.Invalid>();
    expectTypeOf(dc.getInvalid("ID", { strict: false })).toEqualTypeOf<Item.Invalid | undefined>();
    expectTypeOf(dc.getInvalid("ID", { strict: undefined })).toEqualTypeOf<Item.Invalid>();
    expectTypeOf(dc.getInvalid("ID", { strict: trueOrUndefined })).toEqualTypeOf<Item.Invalid>();
    expectTypeOf(dc.getInvalid("ID", { strict: falseOrUndefined })).toEqualTypeOf<Item.Invalid | undefined>();
    expectTypeOf(dc.getInvalid("ID", { strict: boolOrUndefined })).toEqualTypeOf<Item.Invalid | undefined>();

    expectTypeOf(dc.getName("name")).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(dc.getName("name", {})).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(dc.getName("name", { strict: true })).toEqualTypeOf<Item.Stored>();
    expectTypeOf(dc.getName("name", { strict: undefined })).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(dc.getName("name", { strict: trueOrUndefined })).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(dc.getName("name", { strict: falseOrUndefined })).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(dc.getName("name", { strict: boolOrUndefined })).toEqualTypeOf<Item.Stored | undefined>();
  });

  test("Setting and Deleting", () => {
    // @ts-expect-error Document collections only contain stored documents
    dc.set("ID", itemImpl);
    // returns void, for now (13.350): https://github.com/foundryvtt/foundryvtt/issues/13565
    expectTypeOf(dc.set("ID", itemStored)).toBeVoid();

    expectTypeOf(dc.delete("ID")).toBeBoolean();
  });

  test("Searching", () => {
    expectTypeOf(DocumentCollection.getSearchableFields("ActiveEffect")).toEqualTypeOf<
      Record<string, DocumentCollection.SearchableField>
    >();
    expectTypeOf(DocumentCollection.getSearchableFields("Item", "base")).toEqualTypeOf<
      Record<string, DocumentCollection.SearchableField>
    >();

    // @ts-expect-error `#search`'s one parameter has no default, but all its properties do
    dc.search();

    expectTypeOf(dc.search({})).toEqualTypeOf<Item.Stored[]>();
    expectTypeOf(
      dc.search({
        query: "foo",
        filters: [
          { field: "system.bar.value", value: 7, operator: SearchFilter.OPERATORS.GREATER_THAN, negate: false },
          { field: "name", value: "fizz", operator: SearchFilter.OPERATORS.ENDS_WITH, negate: true },
          { field: "system.buzz", value: "magicString" },
        ],
        exclude: ["ID1", "ID2"],
      }),
    ).toEqualTypeOf<Item.Stored[]>();
    expectTypeOf(dc.search({ query: undefined, filters: undefined, exclude: undefined })).toEqualTypeOf<
      Item.Stored[]
    >();
  });

  test("updateAll", () => {
    expectTypeOf(dc.updateAll({ img: "some/path.webp" })).toEqualTypeOf<Promise<Item.Stored[]>>();
    expectTypeOf(dc.updateAll((item) => ({ name: item.name + " 2" }))).toEqualTypeOf<Promise<Item.Stored[]>>();
    expectTypeOf(dc.updateAll({ img: "some/path.webp" }, (item) => item.visible)).toEqualTypeOf<
      Promise<Item.Stored[]>
    >();
    expectTypeOf(dc.updateAll((item) => ({ name: item.name + " 2" }), null)).toEqualTypeOf<Promise<Item.Stored[]>>();
    expectTypeOf(dc.updateAll((item) => ({ name: item.name + " 2" }), null, {})).toEqualTypeOf<
      Promise<Item.Stored[]>
    >();
    expectTypeOf(
      dc.updateAll((item) => ({ name: item.name + " 2" }), null, {
        diff: false,
        recursive: false,
        parent: actor, // TODO: this is nonsense in the world collection, possibly add `OperationForWorldDocuments` helper
      }),
    ).toEqualTypeOf<Promise<Item.Stored[]>>();
  });

  // TODO: _onModifyContents tests exist on the db-ops branch
});
