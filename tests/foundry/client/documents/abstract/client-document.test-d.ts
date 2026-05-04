import { afterAll, describe, expect, expectTypeOf, test } from "vitest";
import { cleanupDocuments } from "../../../../utils.ts";
import * as itemHelpers from "../item.test-d.ts";

import Application = foundry.appv1.api.Application;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;
import ApplicationV2 = foundry.applications.api.ApplicationV2;
import CompendiumCollection = foundry.documents.collections.CompendiumCollection;
import Document = foundry.abstract.Document;
import DialogV2 = foundry.applications.api.DialogV2;
import TextEditor = foundry.applications.ux.TextEditor;
import ClientDocumentMixin = foundry.documents.abstract.ClientDocumentMixin;
import EmbeddedCollection = foundry.abstract.EmbeddedCollection;
import HTMLDocumentEmbedElement = foundry.applications.elements.HTMLDocumentEmbedElement;

const tempItem = new Item.implementation(itemHelpers.source);
const docsToCleanUp = new Set<foundry.documents.abstract.ClientDocumentMixin.AnyMixed>();

// Only properties and methods that both aren't overridden in the document template,
// and aren't conditional in their parameters or return type, are tested here.
describe("ClientDocument Tests", async () => {
  const item = await Item.implementation.create(itemHelpers.source);
  if (!item) throw new Error("Failed to create test Item");
  docsToCleanUp.add(item);

  test("Passthrough of inherited statics", () => {
    // Test the inheritance of static members

    // Document
    expectTypeOf(Item.documentName).toEqualTypeOf<"Item">();
    expect(Item.documentName).toBe("Item");

    // BaseItem
    expectTypeOf(Item.DEFAULT_ICON).toBeString();
  });

  // `#_initialize` overridden with no signature change

  // `#collection`, `#compendium`, and `#inCompendium` are tested per Document

  test("Ownership & Permissions", () => {
    expectTypeOf(item.isOwner).toBeBoolean();
    expect(item.isOwner).toBe(true);

    expectTypeOf(item.hasPlayerOwner).toBeBoolean();
    expect(item.hasPlayerOwner).toBe(false);

    expectTypeOf(item.limited).toBeBoolean();
    expect(item.limited).toBe(false);

    expectTypeOf(item.permission).toEqualTypeOf<CONST.DOCUMENT_OWNERSHIP_LEVELS>();
    expect(item.permission).toBe(CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER);

    expectTypeOf(item.visible).toBeBoolean();
    expect(item.visible).toBe(true);
  });

  afterAll(async () => {
    await cleanupDocuments(docsToCleanUp);
  });
});
declare const someActor: Actor.Implementation;
declare const actorDelta: ActorDelta.Stored;
declare const activeEffect: ActiveEffect.Stored;
const anyClientDoc: ClientDocumentMixin.AnyMixed = tempItem;
// ensure source can be used to create a new document with createDialog
expectTypeOf(Item.createDialog(tempItem.toObject())).toEqualTypeOf<Promise<Item.Stored | null | "ok">>();

declare const itemCreateData: Item.CreateData;
declare const macroCreateData: Macro.CreateData;
const dialogOptions = {
  position: {
    height: 50,
    width: 20000,
    left: 7,
    top: 500,
    scale: 1.0,
  },
  window: {
    icon: "fa-solid fa-user",
  },
} satisfies DialogV2.PromptConfig;

const _x = await Item.createDialog({}, {});

// "ok" if the document creation returns `undefined`
expectTypeOf(Item.createDialog({}, {})).toEqualTypeOf<Promise<Item.Stored | null | "ok">>();
expectTypeOf(
  Item.createDialog(
    itemCreateData,
    {
      pack: "some.pack",
      parent: someActor,
    },
    dialogOptions, // TODO: test relevant options
  ),
).toEqualTypeOf<Promise<Item.Stored | null | "ok">>();

// @ts-expect-error "foo" is not a valid Item type
Item.createDialog({}, { types: ["foo"] });

expectTypeOf(
  Item.createDialog(
    itemCreateData,
    {
      pack: "some.pack",
      parent: someActor,
    },
    {
      types: ["weapon", "armor"], // types we have configured for item testing
      ...dialogOptions,
    },
  ),
).toEqualTypeOf<Promise<Item.Stored | null | "ok">>();
expectTypeOf(
  Item.createDialog(itemCreateData, {
    pack: null,
    parent: null,
  }),
).toEqualTypeOf<Promise<Item.Stored | null | "ok">>();
expectTypeOf(
  Item.createDialog(itemCreateData, {
    pack: undefined,
    parent: undefined,
  }),
).toEqualTypeOf<Promise<Item.Stored | null | "ok">>();

// @ts-expect-error `Macro.metadata.hasTypeData` is not `true`, so passing `types` is not valid
Macro.createDialog(macroCreateData, { types: ["foo"] });

expectTypeOf(Item.defaultName()).toBeString();
expectTypeOf(Item.defaultName({})).toBeString();
expectTypeOf(
  Item.defaultName({
    type: "base",
    pack: "some.pack", // `parent` supersedes `pack` if provided
    parent: someActor,
  }),
).toBeString();
expectTypeOf(Item.defaultName({ type: undefined, pack: null, parent: null })).toBeString();
expectTypeOf(Item.defaultName({ type: undefined, pack: undefined, parent: undefined })).toBeString();

// @ts-expect-error `Macro.metadata.hasTypeData` is not `true`, so passing `type` is not valid
Macro.defaultName({ type: undefined });

declare const itemDropData: Item.DropData;
expectTypeOf(Item.fromDropData(itemDropData)).toEqualTypeOf<Promise<Item.Implementation | undefined>>();

declare const itemSource: Item.Source;
const constructionContext = {
  dropInvalidEmbedded: false,
  fallback: true,
  pack: null,
  parent: null,
  strict: true,
};
expectTypeOf(Item.fromImport(itemSource)).toEqualTypeOf<Promise<Item.Implementation>>();
expectTypeOf(Item.fromImport(itemSource, {})).toEqualTypeOf<Promise<Item.Implementation>>();
expectTypeOf(Item.fromImport(itemSource, constructionContext)).toEqualTypeOf<Promise<Item.Implementation>>();

// Test the inheritance
expectTypeOf(tempItem.documentName).toEqualTypeOf<"Item">(); // Document
expectTypeOf(tempItem.migrateSystemData()).toEqualTypeOf<object>(); // Base-Document
expectTypeOf(tempItem.uuid).toEqualTypeOf<string | null>(); // ClientDocumentMixin
expectTypeOf(tempItem.transferredEffects).toEqualTypeOf<ActiveEffect.Stored[]>(); // class itself

// Properties
declare const someApp: Application.Any;
declare const someAppV2: ApplicationV2.Any;

expectTypeOf(tempItem.apps).toEqualTypeOf<Record<string, Application.Any | ApplicationV2.Any>>();
tempItem.apps["foo"] = someApp;
tempItem.apps["bar"] = someAppV2;
// @ts-expect-error apps is readonly
tempItem.apps = { foo: someApp, bar: someAppV2 };

// _initialize overridden with no signature changes

type AnyRealEmbeddedCollection = _AnyRealEmbeddedCollection<Exclude<Document.EmbeddedType, "ActorDelta">>;

type _AnyRealEmbeddedCollection<Name extends Document.EmbeddedType> = Name extends unknown
  ? EmbeddedCollection<Document.StoredForName<Name>, Document.Embedded.ParentForName<Name>>
  : never;

expectTypeOf(tempItem.collection).toEqualTypeOf<
  | Document.WorldCollectionForName<"Item">
  | EmbeddedCollection<Item.Stored, Document.Embedded.ParentForName<"Item">>
  | null
>();
// @ts-expect-error Only getter, no setter
tempItem.collection = new Collection<typeof tempItem>();

expectTypeOf(actorDelta.collection).toEqualTypeOf<ActorDelta.Stored>();
expectTypeOf(activeEffect.collection).toEqualTypeOf<
  EmbeddedCollection<ActiveEffect.Stored, Actor.Implementation | Item.Implementation>
>();

if (anyClientDoc.collection) {
  expectTypeOf(anyClientDoc.collection).toEqualTypeOf<
    Document.WorldCollectionForName<Document.WorldType> | AnyRealEmbeddedCollection | ActorDelta.Stored
  >();
}

expectTypeOf(tempItem.compendium).toEqualTypeOf<CompendiumCollection<"Item"> | null>();

if (tempItem.compendium) {
  // Regression test for `Type` not being passed through to metadata.
  // Reported by @123499, see https://discord.com/channels/732325252788387980/803646399014109205/1419142467214770317.
  expectTypeOf(tempItem.compendium.metadata.type).toEqualTypeOf<"Item">();
}

// @ts-expect-error Only getter, no setter
tempItem.compendium = game.packs!.contents[0]!;

expectTypeOf(tempItem.isOwner).toBeBoolean();
// @ts-expect-error Only getter, no setter
tempItem.isOwner = false;

expectTypeOf(tempItem.hasPlayerOwner).toBeBoolean();
// @ts-expect-error Only getter, no setter
tempItem.hasPlayerOwner = false;

expectTypeOf(tempItem.limited).toBeBoolean();
// @ts-expect-error Only getter, no setter
tempItem.limited = false;

expectTypeOf(tempItem.link).toBeString();
// @ts-expect-error Only getter, no setter
tempItem.link = "foo";

expectTypeOf(tempItem.permission).toEqualTypeOf<CONST.DOCUMENT_OWNERSHIP_LEVELS>();
// @ts-expect-error Only getter, no setter
tempItem.permission = CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER;

// TODO: change to <FixedInstanceType<ConfiguredSheetClass<Item>> | null> once the circular reference problem has been solved
expectTypeOf(tempItem.sheet).toEqualTypeOf<Application.Any | DocumentSheetV2.Any | null>();
// @ts-expect-error Only getter, no setter
tempItem.sheet = someAppV2;

expectTypeOf(tempItem.visible).toBeBoolean();
// @ts-expect-error Only getter, no setter
tempItem.visible = false;

expectTypeOf(tempItem["_getSheetClass"]()).toEqualTypeOf<
  Application.AnyConstructor | DocumentSheetV2.AnyConstructor | undefined
>();

expectTypeOf(tempItem["_safePrepareData"]()).toBeVoid();
expectTypeOf(tempItem.prepareData()).toBeVoid();
expectTypeOf(tempItem.prepareBaseData()).toBeVoid();
expectTypeOf(tempItem.prepareEmbeddedDocuments()).toBeVoid();
expectTypeOf(tempItem.prepareDerivedData()).toBeVoid();

expectTypeOf(tempItem.render()).toBeVoid();
expectTypeOf(tempItem.render(true)).toBeVoid();
expectTypeOf(tempItem.render(true, {})).toBeVoid();
expectTypeOf(tempItem.render(true, { title: "foo" })).toBeVoid();
// TODO: This will error as long as ApplicationV2.RenderOptions isn't inherently DeepPartialed
// @ts-expect-error Render options not partial yet.
expectTypeOf(tempItem.render(true, { window: { title: "foo" } })).toBeVoid();

declare const sortOptions: foundry.utils.SortOptions<typeof tempItem>;
declare const updateData: Item.UpdateData;
expectTypeOf(tempItem.sortRelative()).toEqualTypeOf<Promise<typeof tempItem>>();
expectTypeOf(tempItem.sortRelative({})).toEqualTypeOf<Promise<typeof tempItem>>();
expectTypeOf(tempItem.sortRelative({ updateData, ...sortOptions })).toEqualTypeOf<Promise<typeof tempItem>>();

expectTypeOf(tempItem.getRelativeUUID(someActor)).toBeString();

// The first argument is unused in core except in JournalEntryPage
expectTypeOf(tempItem._createDocumentLink()).toBeString();
expectTypeOf(tempItem._createDocumentLink({})).toBeString();
expectTypeOf(tempItem._createDocumentLink(null)).toBeString();
expectTypeOf(tempItem._createDocumentLink(null, {})).toBeString();
expectTypeOf(
  tempItem._createDocumentLink(undefined, {
    label: "Some Label",
    relativeTo: someActor,
  }),
).toBeString();
expectTypeOf(
  tempItem._createDocumentLink(
    {},
    {
      label: null,
      relativeTo: null,
    },
  ),
).toBeString();

declare const mouseEvent: MouseEvent;
// this is typed by a fake overload, but does represent the average case
expectTypeOf(tempItem._onClickDocumentLink(mouseEvent)).toEqualTypeOf<ClientDocument.OnClickDocumentLinkReturn>();

declare const storedItem: Item.Stored;
declare const aeCreateDataArray: ActiveEffect.CreateData[];
declare const aeUpdateDataArray: ActiveEffect.UpdateData[];
declare const createdAEs: ActiveEffect.Stored[];
declare const aeIDs: string[];
expectTypeOf(
  tempItem["_preCreateDescendantDocuments"](
    storedItem, // cannot just be `item`
    "effects",
    aeCreateDataArray,
    { action: "create", modifiedTime: 0, render: false, renderSheet: false },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();
expectTypeOf(
  tempItem["_onCreateDescendantDocuments"](
    storedItem,
    "effects",
    createdAEs,
    aeCreateDataArray,
    { action: "create", modifiedTime: 0, render: false, renderSheet: false, parent: tempItem },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

expectTypeOf(
  tempItem["_preUpdateDescendantDocuments"](
    storedItem, // cannot just be `item`
    "effects",
    aeUpdateDataArray,
    { action: "update", modifiedTime: 0, render: false, diff: true, recursive: true },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();
expectTypeOf(
  tempItem["_onUpdateDescendantDocuments"](
    storedItem,
    "effects",
    createdAEs,
    aeUpdateDataArray,
    { action: "update", modifiedTime: 0, render: false, diff: true, recursive: true, parent: tempItem },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

expectTypeOf(
  tempItem["_preDeleteDescendantDocuments"](
    storedItem, // cannot just be `item`
    "effects",
    aeIDs,
    { action: "delete", modifiedTime: 0, render: false },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();
expectTypeOf(
  tempItem["_onDeleteDescendantDocuments"](
    storedItem,
    "effects",
    createdAEs,
    aeIDs,
    { action: "delete", modifiedTime: 0, render: false, parent: tempItem },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

expectTypeOf(tempItem["_onSheetChange"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(tempItem["_onSheetChange"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(tempItem["_onSheetChange"]({ sheetOpen: true })).toEqualTypeOf<Promise<void>>();
expectTypeOf(tempItem["_onSheetChange"]({ sheetOpen: undefined })).toEqualTypeOf<Promise<void>>();

expectTypeOf(tempItem.deleteDialog()).toEqualTypeOf<Promise<Item.Stored | false | null | "yes">>();
expectTypeOf(tempItem.deleteDialog({})).toEqualTypeOf<Promise<Item.Stored | false | null | "yes">>();
expectTypeOf(tempItem.deleteDialog(dialogOptions)).toEqualTypeOf<Promise<Item.Stored | false | null | "yes">>();

// Using exportToJSON to test ToCompendiumOptions for now
expectTypeOf(tempItem.exportToJSON()).toBeVoid();
expectTypeOf(tempItem.exportToJSON({})).toBeVoid();
expectTypeOf(
  tempItem.exportToJSON({
    clearFlags: true,
    clearFolder: true,
    clearOwnership: true,
    clearSort: true,
    clearSource: true,
    clearState: false,
    keepId: true,
  }),
).toBeVoid();
expectTypeOf(
  tempItem.exportToJSON({
    clearFlags: null,
    clearFolder: null,
    clearOwnership: null,
    clearSort: null,
    clearSource: null,
    clearState: null,
    keepId: null,
  }),
).toBeVoid();
expectTypeOf(
  tempItem.exportToJSON({
    clearFlags: undefined,
    clearFolder: undefined,
    clearOwnership: undefined,
    clearSort: undefined,
    clearSource: undefined,
    clearState: undefined,
    keepId: undefined,
  }),
).toBeVoid();

expectTypeOf(tempItem.toDragData()).toEqualTypeOf<Item.DropData>();

expectTypeOf(tempItem.importFromJSON(`{"foo":true}`)).toEqualTypeOf<Promise<typeof tempItem>>();
expectTypeOf(tempItem.importFromJSONDialog()).toEqualTypeOf<Promise<void>>();

// TODO: more thorough tests after `ToCompendiumReturnType` is rewritten or the v13 pass, whichever comes first
expectTypeOf(tempItem.toCompendium()).toEqualTypeOf<ClientDocument.ToCompendiumReturnType<"Item", undefined>>();

declare const enrichmentAnchorOptions: TextEditor.EnrichmentAnchorOptions;
expectTypeOf(tempItem.toAnchor()).toEqualTypeOf<HTMLAnchorElement>();
expectTypeOf(tempItem.toAnchor({})).toEqualTypeOf<HTMLAnchorElement>();
expectTypeOf(tempItem.toAnchor(enrichmentAnchorOptions)).toEqualTypeOf<HTMLAnchorElement>();

declare const enrichmentOptions: TextEditor.EnrichmentOptions;
declare const embedConfig: TextEditor.DocumentHTMLEmbedConfig;
expectTypeOf(tempItem.toEmbed(embedConfig)).toEqualTypeOf<Promise<HTMLElement | null>>();
expectTypeOf(tempItem.toEmbed(embedConfig, {})).toEqualTypeOf<Promise<HTMLElement | null>>();
expectTypeOf(tempItem.toEmbed(embedConfig, enrichmentOptions)).toEqualTypeOf<Promise<HTMLElement | null>>();

expectTypeOf(tempItem["_buildEmbedHTML"](embedConfig)).toEqualTypeOf<Promise<HTMLElement | HTMLCollection | null>>();
expectTypeOf(tempItem["_buildEmbedHTML"](embedConfig, {})).toEqualTypeOf<
  Promise<HTMLElement | HTMLCollection | null>
>();
expectTypeOf(tempItem["_buildEmbedHTML"](embedConfig, enrichmentOptions)).toEqualTypeOf<
  Promise<HTMLElement | HTMLCollection | null>
>();

declare const element: HTMLElement;
declare const htmlCollection: HTMLCollection;

expectTypeOf(tempItem["_createInlineEmbed"](element, embedConfig)).toEqualTypeOf<
  Promise<HTMLDocumentEmbedElement | null>
>();
expectTypeOf(tempItem["_createInlineEmbed"](htmlCollection, embedConfig)).toEqualTypeOf<
  Promise<HTMLDocumentEmbedElement | null>
>();
expectTypeOf(tempItem["_createInlineEmbed"](element, embedConfig, {})).toEqualTypeOf<
  Promise<HTMLDocumentEmbedElement | null>
>();
expectTypeOf(tempItem["_createInlineEmbed"](element, embedConfig, enrichmentOptions)).toEqualTypeOf<
  Promise<HTMLDocumentEmbedElement | null>
>();

expectTypeOf(tempItem["_createFigureEmbed"](element, embedConfig)).toEqualTypeOf<
  Promise<HTMLDocumentEmbedElement | null>
>();
expectTypeOf(tempItem["_createFigureEmbed"](htmlCollection, embedConfig)).toEqualTypeOf<
  Promise<HTMLDocumentEmbedElement | null>
>();
expectTypeOf(tempItem["_createFigureEmbed"](element, embedConfig, {})).toEqualTypeOf<
  Promise<HTMLDocumentEmbedElement | null>
>();
expectTypeOf(tempItem["_createFigureEmbed"](element, embedConfig, enrichmentOptions)).toEqualTypeOf<
  Promise<HTMLDocumentEmbedElement | null>
>();

// omitting tests for deprecated _*EmbeddedDocuments methods
