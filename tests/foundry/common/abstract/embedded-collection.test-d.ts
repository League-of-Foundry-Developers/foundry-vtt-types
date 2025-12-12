import { afterAll, test, describe, expectTypeOf } from "vitest";

import EmbeddedCollection = foundry.abstract.EmbeddedCollection;
import Document = foundry.abstract.Document;

describe("EmbeddedCollection Tests", async () => {
  const docsToCleanUp = new Set<foundry.abstract.Document.AnyStored>();

  const actor = await Actor.implementation.create({
    name: "EmbeddedCollection Test Actor",
    type: "base",
  });
  if (!actor) throw new Error("Failed to create test Actor.");
  docsToCleanUp.add(actor);

  const itemStored = await Item.implementation.create({
    name: "EmbeddedCollection Test Actor",
    type: "base",
  });
  if (!itemStored) throw new Error("Failed to create test Actor.");
  docsToCleanUp.add(itemStored);

  const itemSource = itemStored.toObject();
  const sceneSource = new Scene.implementation({ name: "EmbeddedCollection Test Scene" }).toObject();

  const user = game.users!.contents[0]!;

  const itemCreateData = { name: "Test Item", type: "base" } satisfies Item.CreateData;

  const onItemCreateOperation = {
    action: "create",
    data: [{ name: "Item", type: "base" }],
    modifiedTime: 7,
    parent: null,
    renderSheet: true,
  } satisfies Item.Database2.OnCreateOperation;

  const onItemUpdateOperation = {
    action: "update",
    diff: true,
    modifiedTime: 7,
    parent: null,
    recursive: true,
    updates: [{ name: "Item 2" }],
  } satisfies Item.Database2.OnUpdateOperation;

  const onItemDeleteOperation = {
    action: "delete",
    deleteAll: false,
    ids: ["XXXXXITEMIDXXXXX"],
    modifiedTime: 7,
    parent: null,
  } satisfies Item.Database2.OnDeleteOperation;

  const onSceneUpdateOperation = {
    action: "update",
    diff: true,
    modifiedTime: 7,
    parent: null,
    recursive: true,
    updates: [{ folder: null }],
  } satisfies Scene.Database2.OnUpdateOperation;

  const falseOrUndefined: false | undefined = Math.random() > 0.5 ? false : undefined;
  const trueOrUndefined: true | undefined = Math.random() > 0.5 ? true : undefined;
  const boolOrUndefined: boolean | undefined = Math.random() > 0.66 ? true : Math.random() > 0.5 ? false : undefined;

  test("Construction", () => {
    // EmbeddedCollections must be constructed with explicit type parameters.
    // Constructing without them will only infer the parent doc type, not the source array type:
    expectTypeOf(new EmbeddedCollection("items", actor, [itemSource])).toEqualTypeOf<
      EmbeddedCollection<Document.Any, Actor.Stored>
    >();

    new EmbeddedCollection<Item.Stored, Actor.Stored>("items", actor, [itemSource]);

    // Known limitation: nothing type-side prevents passing incompatible parent and source doc types;
    // this will fail at runtime when `initialize()` is called, same as any other invalid document
    new EmbeddedCollection<Scene.Stored, Actor.Stored>("items", actor, [sceneSource]);
  });

  const ec = new EmbeddedCollection<Item.Stored, Actor.Stored>("items", actor, [itemSource]);

  test("Initialization", () => {
    expectTypeOf(ec["_initialized"]).toBeBoolean();

    expectTypeOf(ec.initialize()).toBeVoid();
    expectTypeOf(ec.initialize({})).toBeVoid();
    expectTypeOf(ec.initialize({ dropInvalidEmbedded: true, fallback: false, strict: true })).toBeVoid();
    expectTypeOf(ec.initialize({ dropInvalidEmbedded: undefined, fallback: undefined, strict: undefined })).toBeVoid();

    expectTypeOf(ec["_initializeDocument"](itemSource)).toBeVoid();
    expectTypeOf(ec["_initializeDocument"](itemSource, {})).toBeVoid();
    expectTypeOf(
      ec["_initializeDocument"](itemSource, {
        dropInvalidEmbedded: false,
        fallback: true,
        strict: false,
      }),
    ).toBeVoid();
    expectTypeOf(
      ec["_initializeDocument"](itemSource, {
        dropInvalidEmbedded: undefined,
        fallback: undefined,
        strict: undefined,
      }),
    ).toBeVoid();

    expectTypeOf(ec.createDocument(itemSource)).toEqualTypeOf<Item.Implementation>();
    expectTypeOf(ec.createDocument(itemSource, {})).toEqualTypeOf<Item.Implementation>();
    expectTypeOf(
      ec.createDocument(itemSource, {
        dropInvalidEmbedded: true,
        fallback: false,
        strict: true,
      }),
    ).toEqualTypeOf<Item.Implementation>();
    expectTypeOf(
      ec.createDocument(itemSource, {
        dropInvalidEmbedded: undefined,
        fallback: undefined,
        strict: undefined,
      }),
    ).toEqualTypeOf<Item.Implementation>();

    expectTypeOf(ec["_handleInvalidDocument"]("ID", new Error())).toBeVoid();
    expectTypeOf(ec["_handleInvalidDocument"]("ID", new Error(), {})).toBeVoid();
    expectTypeOf(ec["_handleInvalidDocument"]("ID", new Error(), { strict: true })).toBeVoid();
    expectTypeOf(ec["_handleInvalidDocument"]("ID", new Error(), { strict: undefined })).toBeVoid();
  });

  test("Miscellaneous", () => {
    expectTypeOf(ec.documentClass).toEqualTypeOf<Item.ImplementationClass>();
    expectTypeOf(ec.model).toEqualTypeOf<Actor.Stored>();

    // we put the constraint on the constructor as `CreateData` and that gets directly assigned to `_source`, so this is correct
    expectTypeOf(ec._source).toEqualTypeOf<Item.Source[]>();

    expectTypeOf(ec.invalidDocumentIds).toEqualTypeOf<Set<string>>();
    expectTypeOf(ec.documentsByType).toEqualTypeOf<Record<string, Item.Stored[]>>();

    // But `toObject` still returns `ContainedDocument["_source"][]`, so:
    // @ts-expect-error Currently .Source is not mapping to ["_source"] properly
    expectTypeOf(ec.toObject()).toEqualTypeOf<Item.Source[]>();
    expectTypeOf(ec.toObject()).toEqualTypeOf<Item.Stored["_source"][]>();

    // Inherited from Collection:
    // TODO: Waiting on a luke reduction
    // expectTypeOf(ec.toJSON()).toEqualTypeOf<Item.Source[]>();
  });

  test("Getting and Searching", () => {
    expectTypeOf(ec.get("ID")).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(ec.get("ID", {})).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(ec.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(ec.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Item.Invalid | Item.Stored>();
    expectTypeOf(ec.get("ID", { invalid: undefined, strict: undefined })).toEqualTypeOf<Item.Stored | undefined>();

    // testing `invalid` (defaults `false`, preventing `.Invalid`s)
    expectTypeOf(ec.get("ID", { invalid: true, strict: true })).toEqualTypeOf<Item.Invalid | Item.Stored>();
    expectTypeOf(ec.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Item.Stored>();
    expectTypeOf(ec.get("ID", { invalid: undefined, strict: true })).toEqualTypeOf<Item.Stored>();
    expectTypeOf(ec.get("ID", { invalid: falseOrUndefined, strict: true })).toEqualTypeOf<Item.Stored>();
    expectTypeOf(ec.get("ID", { invalid: boolOrUndefined, strict: true })).toEqualTypeOf<Item.Invalid | Item.Stored>();
    expectTypeOf(ec.get("ID", { invalid: trueOrUndefined, strict: true })).toEqualTypeOf<Item.Invalid | Item.Stored>();

    // testing `strict` (defaults `false`, allowing `undefined`)
    expectTypeOf(ec.get("ID", { invalid: false, strict: true })).toEqualTypeOf<Item.Stored>();
    expectTypeOf(ec.get("ID", { invalid: false, strict: false })).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(ec.get("ID", { invalid: false, strict: undefined })).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(ec.get("ID", { invalid: false, strict: falseOrUndefined })).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(ec.get("ID", { invalid: false, strict: boolOrUndefined })).toEqualTypeOf<Item.Stored | undefined>();
    expectTypeOf(ec.get("ID", { invalid: false, strict: trueOrUndefined })).toEqualTypeOf<Item.Stored | undefined>();

    expectTypeOf(ec.getInvalid("ID")).toEqualTypeOf<Item.Invalid>();
    expectTypeOf(ec.getInvalid("ID", {})).toEqualTypeOf<Item.Invalid>();
    expectTypeOf(ec.getInvalid("ID", { strict: false })).toEqualTypeOf<Item.Invalid | undefined>();
    expectTypeOf(ec.getInvalid("ID", { strict: undefined })).toEqualTypeOf<Item.Invalid>();
    expectTypeOf(ec.getInvalid("ID", { strict: trueOrUndefined })).toEqualTypeOf<Item.Invalid>();
    expectTypeOf(ec.getInvalid("ID", { strict: falseOrUndefined })).toEqualTypeOf<Item.Invalid | undefined>();
    expectTypeOf(ec.getInvalid("ID", { strict: boolOrUndefined })).toEqualTypeOf<Item.Invalid | undefined>();

    // @ts-expect-error search's one parameter lacks a default, despite `{}` being a valid input
    ec.search();
    expectTypeOf(ec.search({})).toEqualTypeOf<Item.Stored[]>();
    // See `DocumentCollection` tests for through testing of this method, as it's actually from there in the first place

    // Inherited from Collection:
    for (const item of ec) {
      expectTypeOf(item).toEqualTypeOf<Item.Stored>();
    }

    expectTypeOf(ec.contents).toEqualTypeOf<Item.Stored[]>();
  });

  test("Setting", () => {
    expectTypeOf(ec.set("ID", itemStored)).toEqualTypeOf<typeof ec>();
    expectTypeOf(ec.set("ID", itemStored, {})).toEqualTypeOf<typeof ec>();
    expectTypeOf(ec.set("ID", itemStored, { modifySource: false })).toEqualTypeOf<typeof ec>();
    expectTypeOf(ec.set("ID", itemStored, { modifySource: undefined })).toEqualTypeOf<typeof ec>();

    expectTypeOf(ec["_set"]("ID", itemStored)).toBeVoid();
  });

  test("Deleting", () => {
    expectTypeOf(ec.delete("ID")).toBeBoolean();
    expectTypeOf(ec.delete("ID", {})).toBeBoolean();
    expectTypeOf(ec.delete("ID", { modifySource: false })).toBeBoolean();
    expectTypeOf(ec.delete("ID", { modifySource: undefined })).toBeBoolean();

    // same options interface as `#delete` above
    expectTypeOf(ec["_delete"]("ID")).toBeVoid();
  });

  test("_onModifyContents", () => {
    // @ts-expect-error wrong document's operation type
    ec._onModifyContents("update", [itemStored], [itemCreateData], onSceneUpdateOperation);

    expectTypeOf(
      ec._onModifyContents("create", [itemStored], [itemCreateData], onItemCreateOperation, user),
    ).toBeVoid();
    expectTypeOf(
      ec._onModifyContents("update", [itemStored], [itemCreateData], onItemUpdateOperation, user),
    ).toBeVoid();
    expectTypeOf(ec._onModifyContents("delete", [itemStored], ["ID"], onItemDeleteOperation, user)).toBeVoid();
  });

  afterAll(async () => {
    for (const doc of docsToCleanUp) await doc.delete();
  });
});
