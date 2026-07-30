import { describe, expectTypeOf, test } from "vitest";

import CompendiumCollection = foundry.documents.collections.CompendiumCollection;

expectTypeOf(foundry.utils.saveDataToFile("", "", "")).toEqualTypeOf<void>();

declare const file: File;
expectTypeOf(foundry.utils.readTextFromFile(file)).toEqualTypeOf<Promise<string>>();

expectTypeOf(getDocumentClass("Actor")).toEqualTypeOf<Actor.ImplementationClass>();
expectTypeOf(getDocumentClass("Item")).toEqualTypeOf<Item.ImplementationClass>();

declare const tokenDoc: TokenDocument.Stored;
declare const scene: Scene.Stored;
declare const journal: JournalEntry.Stored;

declare const unknownUUID: string;
declare const actorUuid: "Actor.ARandomIDToTest";
declare const settingUuid: "Setting.ARandomIDToTest";
declare const tokenUuid: "Scene.ARandomIDToTest.Token.ARandomIDToTest";
declare const jepUuid: "JournalEntry.ARandomIDToTest.JournalEntryPage.ARandomIDToTest";
declare const compendiumActorUuid: "Compendium.world.a.Actor.ARandomIDToTest";
declare const greatGreatGrandchildUuid: "Scene.ARandomIDToTest.Token.ARandomIDToTest.Actor.ARandomIDToTest.Item.ARandomIDToTest.ActiveEffect.ARandomIDToTest";
declare const compendiumGreatGreatGrandchildUuid: "Compendium.world.pack-name.Scene.ARandomIDToTest.Token.ARandomIDToTest.Actor.ARandomIDToTest.Item.ARandomIDToTest.ActiveEffect.ARandomIDToTest";

describe("fromUuid Tests", () => {
  test("Known UUID", () => {
    // @ts-expect-error This is an invalid Uuid.
    fromUuid("invalid");

    // @ts-expect-error The error emitted here is subpar. Would benefit from throw types.
    // However the usual strategy of returning a union of possible uuids isn't possible here because
    // `Item.${string}` would erroneously allow it as a 'valid' uuid.
    fromUuid("Item.uuid1.Abc.uuid2");

    expectTypeOf(fromUuid("Actor.uuid1")).toEqualTypeOf<Promise<Actor.Stored | null>>();
    expectTypeOf(fromUuid(actorUuid)).toEqualTypeOf<Promise<Actor.Stored | null>>();
    expectTypeOf(fromUuid(compendiumActorUuid)).toEqualTypeOf<Promise<Actor.Stored | null>>();
    expectTypeOf(fromUuid(tokenUuid)).toEqualTypeOf<Promise<TokenDocument.Stored | null>>();
    expectTypeOf(fromUuid(greatGreatGrandchildUuid)).toEqualTypeOf<Promise<ActiveEffect.Stored | null>>();
    expectTypeOf(fromUuid(compendiumGreatGreatGrandchildUuid)).toEqualTypeOf<Promise<ActiveEffect.Stored | null>>();

    // relative:

    expectTypeOf(fromUuid(actorUuid, { relative: undefined })).toEqualTypeOf<Promise<Actor.Stored | null>>;
    // `Actor`s can be found inside `TokenDocument`s.
    expectTypeOf(fromUuid(actorUuid, { relative: tokenDoc })).toEqualTypeOf<Promise<Actor.Stored | null>>;
    // `JournalEntryPage`s can be found inside `JournalEntry`s.
    expectTypeOf(fromUuid(jepUuid, { relative: journal })).toEqualTypeOf<Promise<JournalEntryPage.Stored | null>>;

    // @ts-expect-error `Actor`s cannot be found (directly) inside `Scene`s.
    fromUuid(actorUuid, { relative: scene });
    // @ts-expect-error `Setting`s cannot be found inside anything, the only valid value is `undefined`.
    fromUuid(settingUuid, { relative: scene });
    expectTypeOf(fromUuid(settingUuid, { relative: undefined })).toEqualTypeOf<Promise<Setting.Stored | null>>;

    // invalid:

    expectTypeOf(fromUuid(actorUuid, { invalid: undefined })).toEqualTypeOf<Promise<Actor.Stored | null>>();
    expectTypeOf(fromUuid(actorUuid, { invalid: false })).toEqualTypeOf<Promise<Actor.Stored | null>>();

    expectTypeOf(fromUuid(actorUuid, { invalid: true })).toEqualTypeOf<Promise<Actor.Stored | Actor.Invalid | null>>();
    expectTypeOf(fromUuid(compendiumActorUuid, { invalid: true })).toEqualTypeOf<
      Promise<Actor.Stored | Actor.Invalid | null>
    >();
    expectTypeOf(fromUuid(jepUuid, { invalid: true })).toEqualTypeOf<
      Promise<JournalEntryPage.Stored | JournalEntryPage.Invalid | null>
    >();
    expectTypeOf(fromUuid(settingUuid, { invalid: true })).toEqualTypeOf<
      Promise<Setting.Stored | Setting.Invalid | null>
    >();
  });

  test("Unknown UUID", () => {
    expectTypeOf(fromUuid<Actor.Implementation>(unknownUUID)).toEqualTypeOf<Promise<Actor.Implementation | null>>();
    expectTypeOf(fromUuid<Actor.Stored>(unknownUUID)).toEqualTypeOf<Promise<Actor.Stored | null>>();
    expectTypeOf(fromUuid<Macro.Stored>(unknownUUID)).toEqualTypeOf<Promise<Macro.Stored | null>>();

    // This is actually incorrect but can't be easily fixed.
    // The issue is that as soon as a generic parameter is provided all other generic parameters use their
    // defaults and stop inferring. This means that `Uuid` is `string` and not validatable.
    expectTypeOf(fromUuid<Actor.Implementation>(settingUuid)).toEqualTypeOf<Promise<Actor.Implementation | null>>;

    // relative:

    expectTypeOf(fromUuid<Actor.Stored>(unknownUUID, { relative: undefined })).toEqualTypeOf<
      Promise<Actor.Stored | null>
    >();
    expectTypeOf(fromUuid<Actor.Stored>(unknownUUID, { relative: tokenDoc })).toEqualTypeOf<
      Promise<Actor.Stored | null>
    >();

    // @ts-expect-error `Combatant`s are not found in `JournalEntry`s
    fromUuid<Combatant.Stored>(unknownUUID, { relative: journal });

    // invalid:

    // @ts-expect-error If you're manually passing the document generic, and you want to pass something other than
    // `undefined` for `invalid` in options, you have to manually match that value with the second generic as well.
    fromUuid<Actor.Stored>(unknownUUID, { invalid: true });

    // there would be no reason to ever do this
    expectTypeOf(fromUuid<Actor.Stored>(unknownUUID, { invalid: undefined })).toEqualTypeOf<
      Promise<Actor.Stored | null>
    >();
    // or this
    expectTypeOf(fromUuid<Actor.Stored, false>(unknownUUID, { invalid: false })).toEqualTypeOf<
      Promise<Actor.Stored | null>
    >();

    expectTypeOf(fromUuid<Actor.Stored, true>(unknownUUID, { invalid: true })).toEqualTypeOf<
      Promise<Actor.Stored | Actor.Invalid | null>
    >();
    expectTypeOf(fromUuid<CombatantGroup.Stored, true>(unknownUUID, { invalid: true })).toEqualTypeOf<
      Promise<CombatantGroup.Stored | CombatantGroup.Invalid | null>
    >();
  });
});

describe("fromUuidSync Tests", () => {
  test("Known UUID", () => {
    // @ts-expect-error This is an invalid Uuid.
    fromUuidSync("invalid");

    // @ts-expect-error The error emitted here is subpar. Would benefit from throw types.
    // However the usual strategy of returning a union of possible uuids isn't possible here because
    // `Item.${string}` would erroneously allow it as a 'valid' uuid.
    fromUuidSync("Item.uuid1.Abc.uuid2");

    expectTypeOf(fromUuidSync("Actor.uuid1")).toEqualTypeOf<
      Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | null
    >();
    expectTypeOf(fromUuidSync(actorUuid)).toEqualTypeOf<
      Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | null
    >();
    expectTypeOf(fromUuidSync(compendiumActorUuid)).toEqualTypeOf<
      Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | null
    >();
    // `"Token"` does not extend `Document.CompendiumType`, so no index
    expectTypeOf(fromUuidSync(tokenUuid)).toEqualTypeOf<TokenDocument.Stored | null>();
    expectTypeOf(fromUuidSync(greatGreatGrandchildUuid)).toEqualTypeOf<
      ActiveEffect.Stored | CompendiumCollection.IndexEntry<"ActiveEffect"> | null
    >();
    expectTypeOf(fromUuidSync(compendiumGreatGreatGrandchildUuid)).toEqualTypeOf<
      ActiveEffect.Stored | CompendiumCollection.IndexEntry<"ActiveEffect"> | null
    >();

    // relative:

    expectTypeOf(fromUuidSync(actorUuid, { relative: undefined })).toEqualTypeOf<
      Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | null
    >();
    // `Actor`s can be found inside `TokenDocument`s.
    expectTypeOf(fromUuidSync(actorUuid, { relative: tokenDoc })).toEqualTypeOf<
      Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | null
    >();
    // `JournalEntryPage`s can be found inside `JournalEntry`s, but not directly in compendia.
    expectTypeOf(fromUuidSync(jepUuid, { relative: journal })).toEqualTypeOf<JournalEntryPage.Stored | null>();

    // @ts-expect-error `Actor`s cannot be found (directly) inside `Scene`s.
    fromUuidSync(actorUuid, { relative: scene });
    // @ts-expect-error `Setting`s cannot be found inside anything, the only valid value is `undefined`.
    fromUuidSync(settingUuid, { relative: scene });
    // `Setting`s are never found in compendia, no index.z
    expectTypeOf(fromUuidSync(settingUuid, { relative: undefined })).toEqualTypeOf<Setting.Stored | null>();

    // invalid:

    expectTypeOf(fromUuidSync(actorUuid, { invalid: undefined })).toEqualTypeOf<
      Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | null
    >();
    expectTypeOf(fromUuidSync(actorUuid, { invalid: false })).toEqualTypeOf<
      Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | null
    >();

    expectTypeOf(fromUuidSync(actorUuid, { invalid: true })).toEqualTypeOf<
      Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | Actor.Invalid | null
    >();
    expectTypeOf(fromUuidSync(compendiumActorUuid, { invalid: true })).toEqualTypeOf<
      Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | Actor.Invalid | null
    >();
    expectTypeOf(fromUuidSync(jepUuid, { invalid: true })).toEqualTypeOf<
      JournalEntryPage.Stored | JournalEntryPage.Invalid | null
    >();
    expectTypeOf(fromUuidSync(settingUuid, { invalid: true })).toEqualTypeOf<Setting.Stored | Setting.Invalid | null>();
  });

  test("Unknown UUID", () => {
    expectTypeOf(fromUuidSync<Actor.Implementation>(unknownUUID)).toEqualTypeOf<
      Actor.Implementation | CompendiumCollection.IndexEntry<"Actor"> | null
    >();
    expectTypeOf(fromUuidSync<Actor.Stored>(unknownUUID)).toEqualTypeOf<
      Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | null
    >();
    expectTypeOf(fromUuidSync<Macro.Stored>(unknownUUID)).toEqualTypeOf<
      Macro.Stored | CompendiumCollection.IndexEntry<"Macro"> | null
    >();
    // `TableResult`s are not `Document.CompendiumType`
    expectTypeOf(fromUuidSync<TableResult.Stored>(unknownUUID)).toEqualTypeOf<TableResult.Stored | null>();

    // This is actually incorrect but can't be easily fixed.
    // The issue is that as soon as a generic parameter is provided all other generic parameters use their
    // defaults and stop inferring. This means that `Uuid` is `string` and not validatable.
    expectTypeOf(fromUuidSync<Actor.Implementation>(settingUuid)).toEqualTypeOf<
      Actor.Implementation | CompendiumCollection.IndexEntry<"Actor"> | null
    >;

    // relative:

    expectTypeOf(fromUuidSync<Actor.Stored>(unknownUUID, { relative: undefined })).toEqualTypeOf<
      Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | null
    >();
    expectTypeOf(fromUuidSync<Actor.Stored>(unknownUUID, { relative: tokenDoc })).toEqualTypeOf<
      Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | null
    >();

    // @ts-expect-error `Combatant`s are not found in `JournalEntry`s
    fromUuidSync<Combatant.Stored>(unknownUUID, { relative: journal });

    // invalid:

    // @ts-expect-error If you're manually passing the document generic, and you want to pass something other than
    // `undefined` for `invalid` in options, you have to manually match that value with the second generic as well.
    fromUuidSync<Actor.Stored>(unknownUUID, { invalid: true });

    // there would be no reason to ever do this
    expectTypeOf(fromUuidSync<Actor.Stored>(unknownUUID, { invalid: undefined })).toEqualTypeOf<
      Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | null
    >();
    // or this
    expectTypeOf(fromUuidSync<Actor.Stored, false>(unknownUUID, { invalid: false })).toEqualTypeOf<
      Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | null
    >();

    expectTypeOf(fromUuidSync<Actor.Stored, true>(unknownUUID, { invalid: true })).toEqualTypeOf<
      Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | Actor.Invalid | null
    >();
    // `CombatantGroup`s are not `Document.CompendiumType`
    expectTypeOf(fromUuidSync<CombatantGroup.Stored, true>(unknownUUID, { invalid: true })).toEqualTypeOf<
      CombatantGroup.Stored | CombatantGroup.Invalid | null
    >();
  });
});

interface SortingStructure {
  target: number;
  update: {
    sortKey: number;
  };
}

declare const input: SortingStructure;
expectTypeOf(foundry.utils.performIntegerSort(input, {})).toEqualTypeOf<
  Array<{ target: SortingStructure; update: { sort: number } }>
>();
