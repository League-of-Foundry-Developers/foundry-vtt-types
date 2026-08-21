import { describe, expectTypeOf, test } from "vitest";

import CompendiumCollection = foundry.documents.collections.CompendiumCollection;

test("cleanHTML", () => {
  expectTypeOf(foundry.utils.cleanHTML("foo")).toBeString();
});

test("saveDataToFile", () => {
  expectTypeOf(foundry.utils.saveDataToFile("", "", "")).toEqualTypeOf<void>();
});

declare const file: File;

test("readTextFromFile", () => {
  expectTypeOf(foundry.utils.readTextFromFile(file)).toEqualTypeOf<Promise<string>>();
});

declare const tokenDoc: TokenDocument.Stored;
declare const scene: Scene.Stored;
declare const journal: JournalEntry.Stored;

// eslint-disable-next-line @typescript-eslint/no-inferrable-types
export const unknownUUID: string = "";
export const actorUUID = "Actor.ARandomIDToTest";
export const settingUUID = "Setting.ARandomIDToTest";
export const tokenUUID = "Scene.ARandomIDToTest.Token.ARandomIDToTest";
export const jepUUID = "JournalEntry.ARandomIDToTest.JournalEntryPage.ARandomIDToTest";
export const compendiumActorUUID = "Compendium.world.a.Actor.ARandomIDToTest";
export const greatGreatGrandchildUUID =
  "Scene.ARandomIDToTest.Token.ARandomIDToTest.Actor.ARandomIDToTest.Item.ARandomIDToTest.ActiveEffect.ARandomIDToTest";
export const compendiumGreatGreatGrandchildUUID =
  "Compendium.world.pack-name.Scene.ARandomIDToTest.Token.ARandomIDToTest.Actor.ARandomIDToTest.Item.ARandomIDToTest.ActiveEffect.ARandomIDToTest";
export const relativeItemUUID = ".Item.ARandomIDToTest";

describe("fromUuid Tests", () => {
  test("Known UUID", () => {
    // @ts-expect-error This is an invalid Uuid.
    fromUuid("invalid");

    // @ts-expect-error The error emitted here is subpar. Would benefit from throw types.
    // However the usual strategy of returning a union of possible uuids isn't possible here because
    // `Item.${string}` would erroneously allow it as a 'valid' uuid.
    fromUuid("Item.uuid1.Abc.uuid2");

    expectTypeOf(fromUuid("Actor.uuid1")).toEqualTypeOf<Promise<Actor.Stored | null>>();
    expectTypeOf(fromUuid(actorUUID)).toEqualTypeOf<Promise<Actor.Stored | null>>();
    expectTypeOf(fromUuid(compendiumActorUUID)).toEqualTypeOf<Promise<Actor.Stored | null>>();
    expectTypeOf(fromUuid(tokenUUID)).toEqualTypeOf<Promise<TokenDocument.Stored | null>>();
    expectTypeOf(fromUuid(greatGreatGrandchildUUID)).toEqualTypeOf<Promise<ActiveEffect.Stored | null>>();
    expectTypeOf(fromUuid(compendiumGreatGreatGrandchildUUID)).toEqualTypeOf<Promise<ActiveEffect.Stored | null>>();
    expectTypeOf(fromUuid(relativeItemUUID)).toEqualTypeOf<Promise<Item.Stored | null>>();


    // relative:

    expectTypeOf(fromUuid(actorUUID, { relative: undefined })).toEqualTypeOf<Promise<Actor.Stored | null>>;
    // `Actor`s can be found inside `TokenDocument`s.
    expectTypeOf(fromUuid(actorUUID, { relative: tokenDoc })).toEqualTypeOf<Promise<Actor.Stored | null>>;
    // `JournalEntryPage`s can be found inside `JournalEntry`s.
    expectTypeOf(fromUuid(jepUUID, { relative: journal })).toEqualTypeOf<Promise<JournalEntryPage.Stored | null>>;

    // @ts-expect-error `Actor`s cannot be found (directly) inside `Scene`s.
    fromUuid(actorUUID, { relative: scene });
    // @ts-expect-error `Setting`s cannot be found inside anything, the only valid value is `undefined`.
    fromUuid(settingUUID, { relative: scene });
    expectTypeOf(fromUuid(settingUUID, { relative: undefined })).toEqualTypeOf<Promise<Setting.Stored | null>>;

    // invalid:

    expectTypeOf(fromUuid(actorUUID, { invalid: undefined })).toEqualTypeOf<Promise<Actor.Stored | null>>();
    expectTypeOf(fromUuid(actorUUID, { invalid: false })).toEqualTypeOf<Promise<Actor.Stored | null>>();

    expectTypeOf(fromUuid(actorUUID, { invalid: true })).toEqualTypeOf<Promise<Actor.Stored | Actor.Invalid | null>>();
    expectTypeOf(fromUuid(compendiumActorUUID, { invalid: true })).toEqualTypeOf<
      Promise<Actor.Stored | Actor.Invalid | null>
    >();
    expectTypeOf(fromUuid(jepUUID, { invalid: true })).toEqualTypeOf<
      Promise<JournalEntryPage.Stored | JournalEntryPage.Invalid | null>
    >();
    expectTypeOf(fromUuid(settingUUID, { invalid: true })).toEqualTypeOf<
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
    expectTypeOf(fromUuid<Actor.Implementation>(settingUUID)).toEqualTypeOf<Promise<Actor.Implementation | null>>;

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
    const _x = fromUuidSync("Item.uuid1.Abc.uuid2");

    expectTypeOf(fromUuidSync("Actor.uuid1")).toEqualTypeOf<
      Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | null
    >();
    expectTypeOf(fromUuidSync(actorUUID)).toEqualTypeOf<
      Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | null
    >();
    expectTypeOf(fromUuidSync(compendiumActorUUID)).toEqualTypeOf<
      Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | null
    >();
    // `"Token"` does not extend `Document.CompendiumType`, so no index
    expectTypeOf(fromUuidSync(tokenUUID)).toEqualTypeOf<TokenDocument.Stored | null>();
    expectTypeOf(fromUuidSync(greatGreatGrandchildUUID)).toEqualTypeOf<
      ActiveEffect.Stored | CompendiumCollection.IndexEntry<"ActiveEffect"> | null
    >();
    expectTypeOf(fromUuidSync(compendiumGreatGreatGrandchildUUID)).toEqualTypeOf<
      ActiveEffect.Stored | CompendiumCollection.IndexEntry<"ActiveEffect"> | null
    >();

    // `strict` has no bearing on return type:

    expectTypeOf(fromUuidSync(settingUUID, { strict: true })).toEqualTypeOf<Setting.Stored | null>();
    expectTypeOf(fromUuidSync(settingUUID, { strict: false })).toEqualTypeOf<Setting.Stored | null>();
    expectTypeOf(fromUuidSync(settingUUID, { strict: undefined })).toEqualTypeOf<Setting.Stored | null>();

    // relative:

    expectTypeOf(fromUuidSync(actorUUID, { relative: undefined })).toEqualTypeOf<
      Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | null
    >();
    // `Actor`s can be found inside `TokenDocument`s.
    expectTypeOf(fromUuidSync(actorUUID, { relative: tokenDoc })).toEqualTypeOf<
      Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | null
    >();
    // `JournalEntryPage`s can be found inside `JournalEntry`s, but not directly in compendia.
    expectTypeOf(fromUuidSync(jepUUID, { relative: journal })).toEqualTypeOf<JournalEntryPage.Stored | null>();

    // @ts-expect-error `Actor`s cannot be found (directly) inside `Scene`s.
    fromUuidSync(actorUUID, { relative: scene });
    // @ts-expect-error `Setting`s cannot be found inside anything, the only valid value is `undefined`.
    fromUuidSync(settingUUID, { relative: scene });
    // `Setting`s are never found in compendia, no index.
    expectTypeOf(fromUuidSync(settingUUID, { relative: undefined })).toEqualTypeOf<Setting.Stored | null>();

    // invalid:

    expectTypeOf(fromUuidSync(actorUUID, { invalid: undefined })).toEqualTypeOf<
      Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | null
    >();
    expectTypeOf(fromUuidSync(actorUUID, { invalid: false })).toEqualTypeOf<
      Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | null
    >();

    expectTypeOf(fromUuidSync(actorUUID, { invalid: true })).toEqualTypeOf<
      Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | Actor.Invalid | null
    >();
    expectTypeOf(fromUuidSync(compendiumActorUUID, { invalid: true })).toEqualTypeOf<
      Actor.Stored | CompendiumCollection.IndexEntry<"Actor"> | Actor.Invalid | null
    >();
    expectTypeOf(fromUuidSync(jepUUID, { invalid: true })).toEqualTypeOf<
      JournalEntryPage.Stored | JournalEntryPage.Invalid | null
    >();
    expectTypeOf(fromUuidSync(settingUUID, { invalid: true })).toEqualTypeOf<Setting.Stored | Setting.Invalid | null>();
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
    expectTypeOf(fromUuidSync<Actor.Implementation>(settingUUID)).toEqualTypeOf<
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
    // `CombatantGroup`s are not `Document.CompendiumType`, so no index
    expectTypeOf(fromUuidSync<CombatantGroup.Stored, true>(unknownUUID, { invalid: true })).toEqualTypeOf<
      CombatantGroup.Stored | CombatantGroup.Invalid | null
    >();
  });
});

test("getDocumentClass", () => {
  // getDocumentClass is a blessed global, we don't need to go via `foundry.utils`

  expectTypeOf(getDocumentClass("ActiveEffect")).toEqualTypeOf<ActiveEffect.ImplementationClass>();
  expectTypeOf(getDocumentClass("ActiveEffect").documentName).toEqualTypeOf<"ActiveEffect">();

  expectTypeOf(getDocumentClass("Actor")).toEqualTypeOf<Actor.ImplementationClass>();
  expectTypeOf(getDocumentClass("Actor").documentName).toEqualTypeOf<"Actor">();

  expectTypeOf(getDocumentClass("ActorDelta")).toEqualTypeOf<ActorDelta.ImplementationClass>();
  expectTypeOf(getDocumentClass("ActorDelta").documentName).toEqualTypeOf<"ActorDelta">();

  expectTypeOf(getDocumentClass("Adventure")).toEqualTypeOf<Adventure.ImplementationClass>();
  expectTypeOf(getDocumentClass("Adventure").documentName).toEqualTypeOf<"Adventure">();

  expectTypeOf(getDocumentClass("AmbientLight")).toEqualTypeOf<AmbientLightDocument.ImplementationClass>();
  expectTypeOf(getDocumentClass("AmbientLight").documentName).toEqualTypeOf<"AmbientLight">();

  expectTypeOf(getDocumentClass("AmbientSound")).toEqualTypeOf<AmbientSoundDocument.ImplementationClass>();
  expectTypeOf(getDocumentClass("AmbientSound").documentName).toEqualTypeOf<"AmbientSound">();

  expectTypeOf(getDocumentClass("Card")).toEqualTypeOf<Card.ImplementationClass>();
  expectTypeOf(getDocumentClass("Card").documentName).toEqualTypeOf<"Card">();

  expectTypeOf(getDocumentClass("Cards")).toEqualTypeOf<Cards.ImplementationClass>();
  expectTypeOf(getDocumentClass("Cards").documentName).toEqualTypeOf<"Cards">();

  expectTypeOf(getDocumentClass("ChatMessage")).toEqualTypeOf<ChatMessage.ImplementationClass>();
  expectTypeOf(getDocumentClass("ChatMessage").documentName).toEqualTypeOf<"ChatMessage">();

  expectTypeOf(getDocumentClass("Combat")).toEqualTypeOf<Combat.ImplementationClass>();
  expectTypeOf(getDocumentClass("Combat").documentName).toEqualTypeOf<"Combat">();

  expectTypeOf(getDocumentClass("Combatant")).toEqualTypeOf<Combatant.ImplementationClass>();
  expectTypeOf(getDocumentClass("Combatant").documentName).toEqualTypeOf<"Combatant">();

  expectTypeOf(getDocumentClass("CombatantGroup")).toEqualTypeOf<CombatantGroup.ImplementationClass>();
  expectTypeOf(getDocumentClass("CombatantGroup").documentName).toEqualTypeOf<"CombatantGroup">();

  expectTypeOf(getDocumentClass("Drawing")).toEqualTypeOf<DrawingDocument.ImplementationClass>();
  expectTypeOf(getDocumentClass("Drawing").documentName).toEqualTypeOf<"Drawing">();

  expectTypeOf(getDocumentClass("FogExploration")).toEqualTypeOf<FogExploration.ImplementationClass>();
  expectTypeOf(getDocumentClass("FogExploration").documentName).toEqualTypeOf<"FogExploration">();

  expectTypeOf(getDocumentClass("Folder")).toEqualTypeOf<Folder.ImplementationClass>();
  expectTypeOf(getDocumentClass("Folder").documentName).toEqualTypeOf<"Folder">();

  expectTypeOf(getDocumentClass("Item")).toEqualTypeOf<Item.ImplementationClass>();
  expectTypeOf(getDocumentClass("Item").documentName).toEqualTypeOf<"Item">();

  expectTypeOf(getDocumentClass("JournalEntry")).toEqualTypeOf<JournalEntry.ImplementationClass>();
  expectTypeOf(getDocumentClass("JournalEntry").documentName).toEqualTypeOf<"JournalEntry">();

  expectTypeOf(getDocumentClass("JournalEntryCategory")).toEqualTypeOf<JournalEntryCategory.ImplementationClass>();
  expectTypeOf(getDocumentClass("JournalEntryCategory").documentName).toEqualTypeOf<"JournalEntryCategory">();

  expectTypeOf(getDocumentClass("JournalEntryPage")).toEqualTypeOf<JournalEntryPage.ImplementationClass>();
  expectTypeOf(getDocumentClass("JournalEntryPage").documentName).toEqualTypeOf<"JournalEntryPage">();

  expectTypeOf(getDocumentClass("Level")).toEqualTypeOf<Level.ImplementationClass>();
  expectTypeOf(getDocumentClass("Level").documentName).toEqualTypeOf<"Level">();

  expectTypeOf(getDocumentClass("Macro")).toEqualTypeOf<Macro.ImplementationClass>();
  expectTypeOf(getDocumentClass("Macro").documentName).toEqualTypeOf<"Macro">();

  expectTypeOf(getDocumentClass("Note")).toEqualTypeOf<NoteDocument.ImplementationClass>();
  expectTypeOf(getDocumentClass("Note").documentName).toEqualTypeOf<"Note">();

  expectTypeOf(getDocumentClass("Playlist")).toEqualTypeOf<Playlist.ImplementationClass>();
  expectTypeOf(getDocumentClass("Playlist").documentName).toEqualTypeOf<"Playlist">();

  expectTypeOf(getDocumentClass("PlaylistSound")).toEqualTypeOf<PlaylistSound.ImplementationClass>();
  expectTypeOf(getDocumentClass("PlaylistSound").documentName).toEqualTypeOf<"PlaylistSound">();

  expectTypeOf(getDocumentClass("Region")).toEqualTypeOf<RegionDocument.ImplementationClass>();
  expectTypeOf(getDocumentClass("Region").documentName).toEqualTypeOf<"Region">();

  expectTypeOf(getDocumentClass("RegionBehavior")).toEqualTypeOf<RegionBehavior.ImplementationClass>();
  expectTypeOf(getDocumentClass("RegionBehavior").documentName).toEqualTypeOf<"RegionBehavior">();

  expectTypeOf(getDocumentClass("RollTable")).toEqualTypeOf<RollTable.ImplementationClass>();
  expectTypeOf(getDocumentClass("RollTable").documentName).toEqualTypeOf<"RollTable">();

  expectTypeOf(getDocumentClass("Scene")).toEqualTypeOf<Scene.ImplementationClass>();
  expectTypeOf(getDocumentClass("Scene").documentName).toEqualTypeOf<"Scene">();

  expectTypeOf(getDocumentClass("Setting")).toEqualTypeOf<Setting.ImplementationClass>();
  expectTypeOf(getDocumentClass("Setting").documentName).toEqualTypeOf<"Setting">();

  expectTypeOf(getDocumentClass("TableResult")).toEqualTypeOf<TableResult.ImplementationClass>();
  expectTypeOf(getDocumentClass("TableResult").documentName).toEqualTypeOf<"TableResult">();

  expectTypeOf(getDocumentClass("Tile")).toEqualTypeOf<TileDocument.ImplementationClass>();
  expectTypeOf(getDocumentClass("Tile").documentName).toEqualTypeOf<"Tile">();

  expectTypeOf(getDocumentClass("Token")).toEqualTypeOf<TokenDocument.ImplementationClass>();
  expectTypeOf(getDocumentClass("Token").documentName).toEqualTypeOf<"Token">();

  expectTypeOf(getDocumentClass("User")).toEqualTypeOf<User.ImplementationClass>();
  expectTypeOf(getDocumentClass("User").documentName).toEqualTypeOf<"User">();

  expectTypeOf(getDocumentClass("Wall")).toEqualTypeOf<WallDocument.ImplementationClass>();
  expectTypeOf(getDocumentClass("Wall").documentName).toEqualTypeOf<"Wall">();
});

test("getPlaceableObjectClass", () => {
  expectTypeOf(
    foundry.utils.getPlaceableObjectClass("AmbientLight"),
  ).toEqualTypeOf<foundry.canvas.placeables.AmbientLight.ImplementationClass>();
  expectTypeOf(foundry.utils.getPlaceableObjectClass("AmbientLight").embeddedName).toEqualTypeOf<"AmbientLight">();

  expectTypeOf(
    foundry.utils.getPlaceableObjectClass("AmbientSound"),
  ).toEqualTypeOf<foundry.canvas.placeables.AmbientSound.ImplementationClass>();
  expectTypeOf(foundry.utils.getPlaceableObjectClass("AmbientSound").embeddedName).toEqualTypeOf<"AmbientSound">();

  expectTypeOf(
    foundry.utils.getPlaceableObjectClass("Drawing"),
  ).toEqualTypeOf<foundry.canvas.placeables.Drawing.ImplementationClass>();
  expectTypeOf(foundry.utils.getPlaceableObjectClass("Drawing").embeddedName).toEqualTypeOf<"Drawing">();

  expectTypeOf(
    foundry.utils.getPlaceableObjectClass("Note"),
  ).toEqualTypeOf<foundry.canvas.placeables.Note.ImplementationClass>();
  expectTypeOf(foundry.utils.getPlaceableObjectClass("Note").embeddedName).toEqualTypeOf<"Note">();

  expectTypeOf(
    foundry.utils.getPlaceableObjectClass("Region"),
  ).toEqualTypeOf<foundry.canvas.placeables.Region.ImplementationClass>();
  expectTypeOf(foundry.utils.getPlaceableObjectClass("Region").embeddedName).toEqualTypeOf<"Region">();

  expectTypeOf(
    foundry.utils.getPlaceableObjectClass("Token"),
  ).toEqualTypeOf<foundry.canvas.placeables.Token.ImplementationClass>();
  expectTypeOf(foundry.utils.getPlaceableObjectClass("Token").embeddedName).toEqualTypeOf<"Token">();

  expectTypeOf(
    foundry.utils.getPlaceableObjectClass("Tile"),
  ).toEqualTypeOf<foundry.canvas.placeables.Tile.ImplementationClass>();
  expectTypeOf(foundry.utils.getPlaceableObjectClass("Tile").embeddedName).toEqualTypeOf<"Tile">();

  expectTypeOf(
    foundry.utils.getPlaceableObjectClass("Wall"),
  ).toEqualTypeOf<foundry.canvas.placeables.Wall.ImplementationClass>();
  expectTypeOf(foundry.utils.getPlaceableObjectClass("Wall").embeddedName).toEqualTypeOf<"Wall">();

  // @ts-expect-error Not a placeable type
  foundry.utils.getPlaceableObjectClass("Actor");
});

interface SortingStructure {
  target: number;
  update: {
    sortKey: number;
  };
}

declare const input: SortingStructure;
declare const inputs: SortingStructure[];

test("performIntegerSort", () => {
  expectTypeOf(foundry.utils.performIntegerSort(input)).toEqualTypeOf<
    Array<{ target: SortingStructure; update: { sort: number } }>
  >();
  expectTypeOf(foundry.utils.performIntegerSort(input, {})).toEqualTypeOf<
    Array<{ target: SortingStructure; update: { sort: number } }>
  >();
  expectTypeOf(foundry.utils.performIntegerSort(input, { sortKey: "foo" })).toEqualTypeOf<
    Array<{ target: SortingStructure; update: { foo: number } }>
  >();
  expectTypeOf(foundry.utils.performIntegerSort(input, { siblings: inputs, sortKey: "foo" })).toEqualTypeOf<
    Array<{ target: SortingStructure; update: { foo: number } }>
  >();
  expectTypeOf(
    foundry.utils.performIntegerSort(input, { siblings: inputs, sortKey: "foo", target: input }),
  ).toEqualTypeOf<Array<{ target: SortingStructure; update: { foo: number } }>>();
  expectTypeOf(
    foundry.utils.performIntegerSort(input, { siblings: inputs, sortKey: "foo", target: input, sortBefore: false }),
  ).toEqualTypeOf<Array<{ target: SortingStructure; update: { foo: number } }>>();
  expectTypeOf(
    foundry.utils.performIntegerSort(input, {
      siblings: undefined,
      sortKey: undefined,
      target: undefined,
      sortBefore: undefined,
    }),
  ).toEqualTypeOf<Array<{ target: SortingStructure; update: { sort: number } }>>();
});

test("timeSince", () => {
  expectTypeOf(foundry.utils.timeSince("foo")).toBeString();
  expectTypeOf(foundry.utils.timeSince(new Date())).toBeString();
});

test("getCacheBustURL", () => {
  expectTypeOf(foundry.utils.getCacheBustURL("foo")).toEqualTypeOf<string | false>();
});

test("fetchResource", () => {
  expectTypeOf(foundry.utils.fetchResource("foo")).toEqualTypeOf<Promise<Blob>>();
  expectTypeOf(foundry.utils.fetchResource("foo", { bustCache: true })).toEqualTypeOf<Promise<Blob>>();
  expectTypeOf(foundry.utils.fetchResource("foo", { bustCache: false })).toEqualTypeOf<Promise<Blob>>();
  expectTypeOf(foundry.utils.fetchResource("foo", { bustCache: undefined })).toEqualTypeOf<Promise<Blob>>();
});
