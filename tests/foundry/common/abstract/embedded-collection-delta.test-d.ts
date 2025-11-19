import { test, describe, expectTypeOf } from "vitest";

import EmbeddedCollectionDelta = foundry.abstract.EmbeddedCollectionDelta;
import EmbeddedCollection = foundry.abstract.EmbeddedCollection;
import Document = foundry.abstract.Document;

declare const actorDelta: ActorDelta.Stored;
declare const itemSourceArray: Item.Source[];
declare const itemCreateDataArray: Item.CreateData[];
declare const sceneSourceArray: Scene.Source[];
declare const itemUpdateData: Item.UpdateData;
declare const itemStored: Item.Stored;

describe("EmbeddedCollectionDelta Tests", () => {
  test("Construction", () => {
    // EmbeddedCollections must be constructed with explicit type parameters.
    // Constructing without them will only infer the parent doc type, not the source array type:
    expectTypeOf(new EmbeddedCollectionDelta("items", actorDelta, itemSourceArray)).toEqualTypeOf<
      EmbeddedCollectionDelta<Document.Any, ActorDelta.Stored>
    >();

    // Source is assignable to CreateData, so either is allowed
    new EmbeddedCollectionDelta<Item.Stored, ActorDelta.Stored>("items", actorDelta, itemSourceArray);
    new EmbeddedCollectionDelta<Item.Stored, ActorDelta.Stored>("items", actorDelta, itemCreateDataArray);

    // Known limitation: nothing prevents passing incompatible parent and source doc types
    new EmbeddedCollectionDelta<Scene.Implementation, ActorDelta.Stored>("items", actorDelta, sceneSourceArray);
  });

  const itemCollOnDelta = new EmbeddedCollectionDelta<Item.Stored, ActorDelta.Stored>(
    "items",
    actorDelta,
    itemSourceArray,
  );

  test("Collection getters", () => {
    expectTypeOf(itemCollOnDelta.baseCollection).toEqualTypeOf<EmbeddedCollection<Item.Stored, Actor.Stored>>();
    expectTypeOf(itemCollOnDelta.syntheticCollection).toEqualTypeOf<
      EmbeddedCollection<Item.Stored, Actor.Implementation>
    >();
  });

  test("Miscellaneous", () => {
    expectTypeOf(itemCollOnDelta.manages("ID")).toBeBoolean();
    expectTypeOf(itemCollOnDelta.isTombstone("ID")).toBeBoolean();

    expectTypeOf(itemCollOnDelta.initialize()).toBeVoid();
    // ^ no type changes from the method in super, see there for thorough tests

    // Neither of these methods are ever called in client code, and haven't been found in server code either.
    // They appear vestigial, but we have word from staff they're not. Not sure if there's a secret use or they
    // were just wrong.
    expectTypeOf(itemCollOnDelta.restoreDocument("ID")).toEqualTypeOf<Promise<Item.Stored>>();
    expectTypeOf(itemCollOnDelta.restoreDocuments(["ID1", "ID2"])).toEqualTypeOf<Promise<Item.Stored[]>>();

    expectTypeOf(itemCollOnDelta._prepareDeltaUpdate(itemUpdateData)).toBeVoid();
    expectTypeOf(itemCollOnDelta._prepareDeltaUpdate(itemUpdateData, {})).toBeVoid();
    // ^ 2nd arg is the DataModel.UpdateOptions interface, see DataModel tests for more complete coverage
  });

  // No type changes to `get` from `EmbeddedCollection`

  test("Setting", () => {
    // void return because https://github.com/foundryvtt/foundryvtt/issues/13565
    expectTypeOf(itemCollOnDelta.set("ID", itemStored)).toBeVoid();
    expectTypeOf(itemCollOnDelta.set("ID", itemStored, { modifySource: true, restoreDelta: true })).toBeVoid();
    expectTypeOf(
      itemCollOnDelta.set("ID", itemStored, { modifySource: undefined, restoreDelta: undefined }),
    ).toBeVoid();

    expectTypeOf(itemCollOnDelta["_set"]("ID", itemStored)).toBeVoid();
    expectTypeOf(itemCollOnDelta["_set"]("ID", itemStored, { modifySource: true, restoreDelta: true })).toBeVoid();
    expectTypeOf(
      itemCollOnDelta["_set"]("ID", itemStored, { modifySource: undefined, restoreDelta: undefined }),
    ).toBeVoid();
  });

  test("Deleting", () => {
    // void return because https://github.com/foundryvtt/foundryvtt/issues/13565
    expectTypeOf(itemCollOnDelta.delete("ID")).toBeVoid();
    expectTypeOf(itemCollOnDelta.delete("ID", { modifySource: true, restoreDelta: true })).toBeVoid();
    expectTypeOf(itemCollOnDelta.delete("ID", { modifySource: undefined, restoreDelta: undefined })).toBeVoid();

    expectTypeOf(itemCollOnDelta["_delete"]("ID")).toBeVoid();
    expectTypeOf(itemCollOnDelta["_delete"]("ID", { modifySource: true, restoreDelta: true })).toBeVoid();
    expectTypeOf(itemCollOnDelta["_delete"]("ID", { modifySource: undefined, restoreDelta: undefined })).toBeVoid();
  });
});
