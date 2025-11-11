import { test, describe, expectTypeOf } from "vitest";

import EmbeddedCollection = foundry.abstract.EmbeddedCollection;
import Document = foundry.abstract.Document;

declare const actor: Actor.Stored;
declare const itemSourceArray: Item.Source[];
declare const itemCreateDataArray: Item.CreateData[];
declare const sceneSourceArray: Scene.Source[];
declare const itemStored: Item.Stored;
declare const falseOrUndefined: false | undefined;
declare const trueOrUndefined: true | undefined;
declare const boolOrUndefined: boolean | undefined;

describe("EmbeddedCollection Tests", () => {
  test("Construction", () => {
    // EmbeddedCollections must be constructed with explicit type parameters.
    // Constructing without them will only infer the parent doc type, not the source array type:
    expectTypeOf(new EmbeddedCollection("items", actor, itemSourceArray)).toEqualTypeOf<
      EmbeddedCollection<Document.Any, Actor.Stored>
    >();

    // Source is assignable to CreateData, so either is allowed
    new EmbeddedCollection<Item.Stored, Actor.Stored>("items", actor, itemSourceArray);
    new EmbeddedCollection<Item.Stored, Actor.Stored>("items", actor, itemCreateDataArray);

    // Known limitation: nothing prevents passing incompatible parent and source doc types
    new EmbeddedCollection<ActiveEffect.Stored, Actor.Stored>("items", actor, sceneSourceArray);
  });

  const ec = new EmbeddedCollection<Item.Stored, Actor.Stored>("items", actor, itemSourceArray);

  test("Initialization", () => {
    expectTypeOf(ec.initialize()).toBeVoid();
    expectTypeOf(ec.initialize({})).toBeVoid();
    expectTypeOf(ec.initialize({ dropInvalidEmbedded: true, fallback: false, strict: true })).toBeVoid();
    expectTypeOf(ec.initialize({ dropInvalidEmbedded: undefined, fallback: undefined, strict: undefined })).toBeVoid();

    expectTypeOf(ec["_initializeDocument"](itemSourceArray[0]!)).toBeVoid();
    expectTypeOf(ec["_initializeDocument"](itemSourceArray[0]!, {})).toBeVoid();
    expectTypeOf(
      ec["_initializeDocument"](itemSourceArray[0]!, {
        dropInvalidEmbedded: false,
        fallback: true,
        strict: false,
      }),
    ).toBeVoid();
    expectTypeOf(
      ec["_initializeDocument"](itemSourceArray[0]!, {
        dropInvalidEmbedded: undefined,
        fallback: undefined,
        strict: undefined,
      }),
    ).toBeVoid();

    expectTypeOf(ec.createDocument(itemSourceArray[0]!)).toEqualTypeOf<Item.Implementation>();
    expectTypeOf(ec.createDocument(itemSourceArray[0]!, {})).toEqualTypeOf<Item.Implementation>();
    expectTypeOf(
      ec.createDocument(itemSourceArray[0]!, {
        dropInvalidEmbedded: true,
        fallback: false,
        strict: true,
      }),
    ).toEqualTypeOf<Item.Implementation>();
    expectTypeOf(
      ec.createDocument(itemSourceArray[0]!, {
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

  test("Miscellaneous", () => {
    expectTypeOf(ec.documentClass).toEqualTypeOf<Item.ImplementationClass>();
    expectTypeOf(ec.model).toEqualTypeOf<Actor.Stored>();
    expectTypeOf(ec.documentsByType).toEqualTypeOf<Record<string, Item.Stored[]>>();

    // we put the constraint on the constructor as `CreateData` and that gets directly assigned to `_source`, so this is correct
    expectTypeOf(ec._source).toEqualTypeOf<Item.CreateData[]>();

    // But `toObject` still returns `ContainedDocument["_source"][]`, so:
    // @ts-expect-error Currently .Source is not mapping to ["_source"] properly
    expectTypeOf(ec.toObject()).toEqualTypeOf<Item.Source[]>();
    expectTypeOf(ec.toObject()).toEqualTypeOf<Item.Stored["_source"][]>();

    // Inherited from Collection:
    // TODO: Waiting on a luke reduction
    // expectTypeOf(itemCollOnActor.toJSON()).toEqualTypeOf<Item.Source[]>();
  });
});
