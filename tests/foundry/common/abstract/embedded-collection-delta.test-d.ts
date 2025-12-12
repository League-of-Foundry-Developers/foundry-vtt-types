import { afterAll, test, describe, expectTypeOf } from "vitest";

import EmbeddedCollectionDelta = foundry.abstract.EmbeddedCollectionDelta;
import EmbeddedCollection = foundry.abstract.EmbeddedCollection;
import Document = foundry.abstract.Document;

describe("EmbeddedCollectionDelta Tests", async () => {
  const docsToCleanUp = new Set<foundry.abstract.Document.AnyStored>();

  const actor = await Actor.implementation.create({
    name: "EmbeddedCollectionDelta Test Actor",
    type: "character",
  });
  if (!actor) throw new Error("Failed to create test Actor.");
  docsToCleanUp.add(actor);

  const item = await Item.implementation.create({
    name: "EmbeddedCollectionDelta Test Item",
    type: "base",
  });
  if (!item) throw new Error("Failed to create test Item.");
  docsToCleanUp.add(item);

  const scene = await Scene.implementation.create({ name: "EmbeddedCollectionDelta Test Scene" });
  if (!scene) throw new Error("Failed to create test Scene.");
  docsToCleanUp.add(scene);

  const sceneSource = scene.toObject();

  const tokenDoc = await TokenDocument.implementation.create(
    // @ts-expect-error `TokenDocument.create` will take a `TokenDocument` on the db-ops branch
    await actor.getTokenDocument({ x: 200, y: 200, actorLink: false }),
    {
      parent: scene,
    },
  );
  if (!tokenDoc) throw new Error("Failed to create test TokenDocument");
  // not added to cleanup as it will get tidied with its parent scene
  // docsToCleanUp.add(tokenDoc)

  // cast required because
  // a) could be `null`, but wont be at runtime given the above
  // b) the initialized type of the `EmbeddedDeltaCollectionField` is `.Implementation`, not `.Stored`
  const actorDelta = tokenDoc.delta as ActorDelta.Stored;

  const itemSource = item.toObject();
  const itemUpdateData = { img: "path/to/foo.png" } satisfies Item.UpdateData;

  test("Construction", () => {
    // EmbeddedCollections must be constructed with explicit type parameters.
    // Constructing without them will only infer the parent doc type, not the source array type:
    expectTypeOf(new EmbeddedCollectionDelta("items", actorDelta, [itemSource])).toEqualTypeOf<
      EmbeddedCollectionDelta<Document.Any, ActorDelta.Stored>
    >();

    // Source is assignable to CreateData, so either is allowed
    new EmbeddedCollectionDelta<Item.Stored, ActorDelta.Stored>("items", actorDelta, [itemSource]);

    // Known limitation: nothing prevents passing incompatible parent and source doc types
    new EmbeddedCollectionDelta<Scene.Implementation, ActorDelta.Stored>("items", actorDelta, [sceneSource]);
  });

  const itemCollOnDelta = new EmbeddedCollectionDelta<Item.Stored, ActorDelta.Stored>("items", actorDelta, [
    itemSource,
  ]);

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
    expectTypeOf(itemCollOnDelta.set("ID", item)).toBeVoid();
    expectTypeOf(itemCollOnDelta.set("ID", item, { modifySource: true, restoreDelta: true })).toBeVoid();
    expectTypeOf(itemCollOnDelta.set("ID", item, { modifySource: undefined, restoreDelta: undefined })).toBeVoid();

    expectTypeOf(itemCollOnDelta["_set"]("ID", item)).toBeVoid();
    expectTypeOf(itemCollOnDelta["_set"]("ID", item, { modifySource: true, restoreDelta: true })).toBeVoid();
    expectTypeOf(itemCollOnDelta["_set"]("ID", item, { modifySource: undefined, restoreDelta: undefined })).toBeVoid();
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

  afterAll(async () => {
    for (const doc of docsToCleanUp) await doc.delete();
  });
});
