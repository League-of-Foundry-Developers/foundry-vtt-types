import { test, describe, expectTypeOf } from "vitest";

import EmbeddedCollection = foundry.abstract.EmbeddedCollection;
import Document = foundry.abstract.Document;

declare const actor: Actor.Stored;
declare const user: User.Stored;
declare const itemSourceArray: Item.Source[];
declare const itemCreateDataArray: Item.CreateData[];
declare const sceneSourceArray: Scene.Source[];
declare const itemImpl: Item.Implementation;
declare const itemStored: Item.Stored;
declare const onItemCreateOperation: Item.Database2.OnCreateOperation;
declare const onItemUpdateOperation: Item.Database2.OnUpdateOperation;
declare const onItemDeleteOperation: Item.Database2.OnDeleteOperation;
declare const onSceneUpdateOperation: Scene.Database2.OnUpdateOperation;

describe("EmbeddedCollection Tests", () => {
  test("Construction", () => {
    // EmbeddedCollections must be constructed with explicit type parameters.
    // Constructing without them will only infer the parent doc type, not the source array type:
    expectTypeOf(new EmbeddedCollection("items", actor, itemSourceArray)).toEqualTypeOf<
      EmbeddedCollection<Document.Any, Actor.Stored>
    >();
    // CreateData is also passable with only inferred types
    new EmbeddedCollection("items", actor, itemCreateDataArray);

    // @ts-expect-error Passing .Stored for the source doc type prevents passing source data
    new EmbeddedCollection<Item.Stored, Actor.Stored>("items", actor, itemSourceArray);
    // @ts-expect-error Passing .Stored for the source doc type also prevents passing CreateData
    new EmbeddedCollection<Item.Stored, Actor.Stored>("items", actor, itemCreateDataArray);

    // Passing Implementation for the source doc type works...
    new EmbeddedCollection<Item.Implementation, Actor.Stored>("items", actor, itemSourceArray);
    // @ts-expect-error ...But it prevents passing CreateData
    new EmbeddedCollection<Item.Implementation, Actor.Stored>("items", actor, itemCreateDataArray);

    // Known limitation: nothing prevents passing incompatible parent and source doc types
    new EmbeddedCollection<Scene.Implementation, Actor.Stored>("items", actor, sceneSourceArray);
  });

  const itemCollOnActor = new EmbeddedCollection<Item.Implementation, Actor.Stored>("items", actor, itemSourceArray);

  test("Initialization", () => {
    expectTypeOf(itemCollOnActor.initialize()).toBeVoid();
    expectTypeOf(itemCollOnActor.initialize({})).toBeVoid();
    expectTypeOf(itemCollOnActor.initialize({ dropInvalidEmbedded: true, fallback: false, strict: true })).toBeVoid();
    expectTypeOf(
      itemCollOnActor.initialize({ dropInvalidEmbedded: undefined, fallback: undefined, strict: undefined }),
    ).toBeVoid();

    expectTypeOf(itemCollOnActor["_initializeDocument"](itemSourceArray[0]!)).toBeVoid();
    expectTypeOf(itemCollOnActor["_initializeDocument"](itemSourceArray[0]!, {})).toBeVoid();
    expectTypeOf(
      itemCollOnActor["_initializeDocument"](itemSourceArray[0]!, {
        dropInvalidEmbedded: false,
        fallback: true,
        strict: false,
      }),
    ).toBeVoid();
    expectTypeOf(
      itemCollOnActor["_initializeDocument"](itemSourceArray[0]!, {
        dropInvalidEmbedded: undefined,
        fallback: undefined,
        strict: undefined,
      }),
    ).toBeVoid();

    expectTypeOf(itemCollOnActor.createDocument(itemSourceArray[0]!)).toEqualTypeOf<Item.Implementation>();
    expectTypeOf(itemCollOnActor.createDocument(itemSourceArray[0]!, {})).toEqualTypeOf<Item.Implementation>();
    expectTypeOf(
      itemCollOnActor.createDocument(itemSourceArray[0]!, {
        dropInvalidEmbedded: true,
        fallback: false,
        strict: true,
      }),
    ).toEqualTypeOf<Item.Implementation>();
    expectTypeOf(
      itemCollOnActor.createDocument(itemSourceArray[0]!, {
        dropInvalidEmbedded: undefined,
        fallback: undefined,
        strict: undefined,
      }),
    ).toEqualTypeOf<Item.Implementation>();

    expectTypeOf(itemCollOnActor["_handleInvalidDocument"]("ID", new Error())).toBeVoid();
    expectTypeOf(itemCollOnActor["_handleInvalidDocument"]("ID", new Error(), {})).toBeVoid();
    expectTypeOf(itemCollOnActor["_handleInvalidDocument"]("ID", new Error(), { strict: true })).toBeVoid();
    expectTypeOf(itemCollOnActor["_handleInvalidDocument"]("ID", new Error(), { strict: undefined })).toBeVoid();
  });

  test("Getting and Searching", () => {
    expectTypeOf(itemCollOnActor.get("ID")).toEqualTypeOf<Item.Implementation | undefined>();
    expectTypeOf(itemCollOnActor.get("ID", {})).toEqualTypeOf<Item.Implementation | undefined>();
    expectTypeOf(itemCollOnActor.get("ID", { invalid: true })).toEqualTypeOf<Item.Invalid | undefined>();
    expectTypeOf(itemCollOnActor.get("ID", { invalid: false })).toEqualTypeOf<Item.Implementation | undefined>();
    expectTypeOf(itemCollOnActor.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Item.Implementation>();
    expectTypeOf(itemCollOnActor.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Item.Invalid>();

    expectTypeOf(itemCollOnActor.getInvalid("ID")).toEqualTypeOf<Item.Invalid>();
    expectTypeOf(itemCollOnActor.getInvalid("ID", {})).toEqualTypeOf<Item.Invalid>();
    expectTypeOf(itemCollOnActor.getInvalid("ID", { strict: false })).toEqualTypeOf<Item.Invalid | undefined>();
    expectTypeOf(itemCollOnActor.getInvalid("ID", { strict: undefined })).toEqualTypeOf<Item.Invalid>();

    // @ts-expect-error search's one parameter lacks a default, despite `{}` being a valid input
    itemCollOnActor.search();
    expectTypeOf(itemCollOnActor.search({})).toEqualTypeOf<Item.Implementation[]>();
    // See `DocumentCollection` tests for through testing of this method, as it's actually from there in the first place

    // Inherited from Collection:
    for (const item of itemCollOnActor) {
      expectTypeOf(item).toEqualTypeOf<Item.Implementation>();
    }

    expectTypeOf(itemCollOnActor.contents).toEqualTypeOf<Item.Implementation[]>();
  });

  test("Setting", () => {
    expectTypeOf(itemCollOnActor.set("ID", itemImpl)).toEqualTypeOf<typeof itemCollOnActor>();
    expectTypeOf(itemCollOnActor.set("ID", itemStored)).toEqualTypeOf<typeof itemCollOnActor>();
    expectTypeOf(itemCollOnActor.set("ID", itemStored, {})).toEqualTypeOf<typeof itemCollOnActor>();
    expectTypeOf(itemCollOnActor.set("ID", itemStored, { modifySource: false })).toEqualTypeOf<
      typeof itemCollOnActor
    >();
    expectTypeOf(itemCollOnActor.set("ID", itemStored, { modifySource: undefined })).toEqualTypeOf<
      typeof itemCollOnActor
    >();

    expectTypeOf(itemCollOnActor["_set"]("ID", itemImpl)).toBeVoid();
    expectTypeOf(itemCollOnActor["_set"]("ID", itemStored)).toBeVoid();
  });

  test("Deleting", () => {
    expectTypeOf(itemCollOnActor.delete("ID")).toBeBoolean();
    expectTypeOf(itemCollOnActor.delete("ID", {})).toBeBoolean();
    expectTypeOf(itemCollOnActor.delete("ID", { modifySource: false })).toBeBoolean();
    expectTypeOf(itemCollOnActor.delete("ID", { modifySource: undefined })).toBeBoolean();

    // same options interface as `#delete` above
    expectTypeOf(itemCollOnActor["_delete"]("ID")).toBeVoid();
  });

  test("Miscellaneous", () => {
    expectTypeOf(itemCollOnActor.documentClass).toEqualTypeOf<Item.ImplementationClass>();
    expectTypeOf(itemCollOnActor.model).toEqualTypeOf<Actor.Stored>();
    expectTypeOf(itemCollOnActor.documentsByType).toEqualTypeOf<Record<string, Item.Implementation[]>>();

    // @ts-expect-error Currently .Source is not mapping to ["_source"] properly
    expectTypeOf(itemCollOnActor._source).toEqualTypeOf<Item.Source[]>();
    expectTypeOf(itemCollOnActor._source).toEqualTypeOf<Item.Implementation["_source"][]>();
    // @ts-expect-error Currently .Source is not mapping to ["_source"] properly
    expectTypeOf(itemCollOnActor.toObject()).toEqualTypeOf<Item.Source[]>();
    expectTypeOf(itemCollOnActor.toObject()).toEqualTypeOf<Item.Implementation["_source"][]>();

    // Inherited from Collection:
    // TODO: Waiting on a luke reduction
    // expectTypeOf(itemCollOnActor.toJSON()).toEqualTypeOf<Item.Source[]>();
  });

  test("OnModifyContents", () => {
    // @ts-expect-error wrong document's operation type
    itemCollOnActor._onModifyContents("update", [itemImpl], itemCreateDataArray, onSceneUpdateOperation);
    expectTypeOf(
      itemCollOnActor._onModifyContents("create", [itemImpl], itemCreateDataArray, onItemCreateOperation, user),
    ).toBeVoid();
    expectTypeOf(
      itemCollOnActor._onModifyContents("update", [itemImpl], itemCreateDataArray, onItemUpdateOperation, user),
    ).toBeVoid();
    expectTypeOf(
      itemCollOnActor._onModifyContents("delete", [itemImpl], ["ID"], onItemDeleteOperation, user),
    ).toBeVoid();
  });
});
