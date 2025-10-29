import { test, describe, expectTypeOf } from "vitest";

import EmbeddedCollectionDelta = foundry.abstract.EmbeddedCollectionDelta;
import EmbeddedCollection = foundry.abstract.EmbeddedCollection;
import Document = foundry.abstract.Document;

declare const actorDelta: ActorDelta.Stored;
declare const itemSourceArray: Item.Source[];
declare const itemCreateDataArray: Item.CreateData[];
declare const sceneSourceArray: Scene.Source[];
declare const itemUpdateData: Item.UpdateData;
declare const itemImpl: Item.Implementation;

describe("EmbeddedCollectionDelta Tests", () => {
  test("Construction", () => {
    // EmbeddedCollections must be constructed with explicit type parameters.
    // Constructing without them will only infer the parent doc type, not the source array type:
    expectTypeOf(new EmbeddedCollectionDelta("items", actorDelta, itemSourceArray)).toEqualTypeOf<
      EmbeddedCollectionDelta<Document.Any, ActorDelta.Stored>
    >();
    // CreateData is also passable with only inferred types
    new EmbeddedCollectionDelta("items", actorDelta, itemCreateDataArray);

    // @ts-expect-error Passing .Stored for the source doc type prevents passing source data
    new EmbeddedCollectionDelta<Item.Stored, ActorDelta.Stored>("items", actorDelta, itemSourceArray);
    // @ts-expect-error Passing .Stored for the source doc type also prevents passing CreateData
    new EmbeddedCollectionDelta<Item.Stored, ActorDelta.Stored>("items", actorDelta, itemCreateDataArray);

    // Passing Implementation for the source doc type works...
    new EmbeddedCollectionDelta<Item.Implementation, ActorDelta.Stored>("items", actorDelta, itemSourceArray);
    // @ts-expect-error ...But it prevents passing CreateData
    new EmbeddedCollectionDelta<Item.Implementation, ActorDelta.Stored>("items", actorDelta, itemCreateDataArray);

    // Known limitation: nothing prevents passing incompatible parent and source doc types
    new EmbeddedCollectionDelta<Scene.Implementation, ActorDelta.Stored>("items", actorDelta, sceneSourceArray);
  });

  const itemCollOnDelta = new EmbeddedCollectionDelta<Item.Implementation, ActorDelta.Stored>(
    "items",
    actorDelta,
    itemSourceArray,
  );

  test("Collection getters", () => {
    expectTypeOf(itemCollOnDelta.baseCollection).toEqualTypeOf<
      EmbeddedCollection<Item.Implementation, Actor.Implementation>
    >();
    expectTypeOf(itemCollOnDelta.syntheticCollection).toEqualTypeOf<
      EmbeddedCollection<Item.Implementation, Actor.Implementation>
    >();
  });

  test("Miscellaneous", () => {
    expectTypeOf(itemCollOnDelta.manages("ID")).toBeBoolean();
    expectTypeOf(itemCollOnDelta.isTombstone("ID")).toBeBoolean();

    expectTypeOf(itemCollOnDelta.initialize()).toBeVoid();
    // ^ no type changes from the method in super, see there for thorough tests

    // Neither of these methods are ever called in client code, and haven't been found in server code either.
    // They might be vestigial.
    expectTypeOf(itemCollOnDelta.restoreDocument("ID")).toEqualTypeOf<Promise<Item.Implementation>>();
    expectTypeOf(itemCollOnDelta.restoreDocuments(["ID1", "ID2"])).toEqualTypeOf<Promise<Item.Implementation[]>>();

    expectTypeOf(itemCollOnDelta._prepareDeltaUpdate(itemUpdateData)).toBeVoid();
    expectTypeOf(itemCollOnDelta._prepareDeltaUpdate(itemUpdateData, {})).toBeVoid();
    // ^ 2nd arg is the DataModel.UpdateOptions interface, see DataModel tests for more complete coverage
  });

  test("Setting", () => {
    expectTypeOf(itemCollOnDelta.set("ID", itemImpl)).toEqualTypeOf<typeof itemCollOnDelta>();
    expectTypeOf(itemCollOnDelta.set("ID", itemImpl, { modifySource: true, restoreDelta: true })).toEqualTypeOf<
      typeof itemCollOnDelta
    >();
    expectTypeOf(
      itemCollOnDelta.set("ID", itemImpl, { modifySource: undefined, restoreDelta: undefined }),
    ).toEqualTypeOf<typeof itemCollOnDelta>();

    expectTypeOf(itemCollOnDelta["_set"]("ID", itemImpl)).toBeVoid();
    expectTypeOf(itemCollOnDelta["_set"]("ID", itemImpl, { modifySource: true, restoreDelta: true })).toBeVoid();
    expectTypeOf(
      itemCollOnDelta["_set"]("ID", itemImpl, { modifySource: undefined, restoreDelta: undefined }),
    ).toBeVoid();
  });

  test("Deleting", () => {
    expectTypeOf(itemCollOnDelta.delete("ID")).toBeBoolean();
    expectTypeOf(itemCollOnDelta.delete("ID", { modifySource: true, restoreDelta: true })).toBeBoolean();
    expectTypeOf(itemCollOnDelta.delete("ID", { modifySource: undefined, restoreDelta: undefined })).toBeBoolean();

    expectTypeOf(itemCollOnDelta["_delete"]("ID")).toBeVoid();
    expectTypeOf(itemCollOnDelta["_delete"]("ID", { modifySource: true, restoreDelta: true })).toBeVoid();
    expectTypeOf(itemCollOnDelta["_delete"]("ID", { modifySource: undefined, restoreDelta: undefined })).toBeVoid();
  });
});
