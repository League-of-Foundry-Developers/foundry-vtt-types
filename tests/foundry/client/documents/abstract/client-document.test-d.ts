import { expectTypeOf } from "vitest";
import type { FixedInstanceType } from "fvtt-types/utils";

import Application = foundry.appv1.api.Application;
import ApplicationV2 = foundry.applications.api.ApplicationV2;
import CompendiumCollection = foundry.documents.collections.CompendiumCollection;
import Document = foundry.abstract.Document;
import DialogV2 = foundry.applications.api.DialogV2;
import FormApplication = foundry.appv1.api.FormApplication;
import TextEditor = foundry.applications.ux.TextEditor;

const item = new Item.implementation({ name: "foo", type: "base" });
declare const someActor: Actor.Implementation;
// Test the inheritance of static members
expectTypeOf(Item.documentName).toEqualTypeOf<"Item">(); // Document
expectTypeOf(Item.createDialog()).toEqualTypeOf<Promise<Item.Stored | null | "ok">>(); // ClientDocumentMixin

// ensure source can be used to create a new document with createDialog
expectTypeOf(Item.createDialog(item.toObject())).toEqualTypeOf<Promise<Item.Stored | null | "ok">>();

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
expectTypeOf(item.documentName).toEqualTypeOf<"Item">(); // Document
expectTypeOf(item.migrateSystemData()).toEqualTypeOf<object>(); // Base-Document
expectTypeOf(item.uuid).toEqualTypeOf<string>(); // ClientDocumentMixin
expectTypeOf(item.transferredEffects).toEqualTypeOf<ActiveEffect.Implementation[]>(); // class itself

// Properties
declare const someApp: Application.Any;
declare const someAppV2: ApplicationV2.Any;

expectTypeOf(item.apps).toEqualTypeOf<Record<string, Application.Any | ApplicationV2.Any>>();
item.apps["foo"] = someApp;
item.apps["bar"] = someAppV2;
// @ts-expect-error apps is readonly
item.apps = { foo: someApp, bar: someAppV2 };

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
expectTypeOf(item["_sheet"]).toEqualTypeOf<FixedInstanceType<Document.SheetClassFor<"Item">> | null>();

// _initialize overridden with no signature changes

// TODO This will also match `Item`, but not `Item.Implementation`
expectTypeOf(item.collection).toEqualTypeOf<Collection<Item.Stored> | null>();
// @ts-expect-error Only getter, no setter
item.collection = new Collection<typeof item>();

expectTypeOf(item.compendium).toEqualTypeOf<CompendiumCollection<"Item">>();

// Regression test for `Type` not being passed through to metadata.
// Reported by @123499, see https://discord.com/channels/732325252788387980/803646399014109205/1419142467214770317.
expectTypeOf(item.compendium.metadata.type).toEqualTypeOf<"Item">();

// @ts-expect-error Only getter, no setter
item.compendium = game.packs!.contents[0]!;

expectTypeOf(item.isOwner).toBeBoolean();
// @ts-expect-error Only getter, no setter
item.isOwner = false;

expectTypeOf(item.hasPlayerOwner).toBeBoolean();
// @ts-expect-error Only getter, no setter
item.hasPlayerOwner = false;

expectTypeOf(item.limited).toBeBoolean();
// @ts-expect-error Only getter, no setter
item.limited = false;

expectTypeOf(item.link).toBeString();
// @ts-expect-error Only getter, no setter
item.link = "foo";

expectTypeOf(item.permission).toEqualTypeOf<CONST.DOCUMENT_OWNERSHIP_LEVELS | null>();
// @ts-expect-error Only getter, no setter
item.permission = CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER;

// TODO: change to <FixedInstanceType<ConfiguredSheetClass<Item>> | null> once the circular reference problem has been solved
expectTypeOf(item.sheet).toEqualTypeOf<FormApplication.Any | ApplicationV2.Any | null>();
// @ts-expect-error Only getter, no setter
item.sheet = someAppV2;

expectTypeOf(item.visible).toBeBoolean();
// @ts-expect-error Only getter, no setter
item.visible = false;

expectTypeOf(item["_getSheetClass"]()).toEqualTypeOf<
  FormApplication.AnyConstructor | ApplicationV2.AnyConstructor | null
>();

expectTypeOf(item["_safePrepareData"]()).toBeVoid();
expectTypeOf(item.prepareData()).toBeVoid();
expectTypeOf(item.prepareBaseData()).toBeVoid();
expectTypeOf(item.prepareEmbeddedDocuments()).toBeVoid();
expectTypeOf(item.prepareDerivedData()).toBeVoid();

expectTypeOf(item.render()).toBeVoid();
expectTypeOf(item.render(true)).toBeVoid();
expectTypeOf(item.render(true, {})).toBeVoid();
expectTypeOf(item.render(true, { title: "foo" })).toBeVoid();
// TODO: This will error as long as ApplicationV2.RenderOptions isn't inherently DeepPartialed
// @ts-expect-error Render options not partial yet.
expectTypeOf(item.render(true, { window: { title: "foo" } })).toBeVoid();

declare const sortOptions: foundry.utils.SortOptions<typeof item>;
declare const updateData: Item.UpdateData;
expectTypeOf(item.sortRelative()).toEqualTypeOf<Promise<typeof item>>();
expectTypeOf(item.sortRelative({})).toEqualTypeOf<Promise<typeof item>>();
expectTypeOf(item.sortRelative({ updateData, ...sortOptions })).toEqualTypeOf<Promise<typeof item>>();

expectTypeOf(item.getRelativeUUID(someActor)).toBeString();

// The first argument is unused in core except in JournalEntryPage
expectTypeOf(item._createDocumentLink()).toBeString();
expectTypeOf(item._createDocumentLink({})).toBeString();
expectTypeOf(item._createDocumentLink(null)).toBeString();
expectTypeOf(item._createDocumentLink(null, {})).toBeString();
expectTypeOf(
  item._createDocumentLink(undefined, {
    label: "Some Label",
    relativeTo: someActor,
  }),
).toBeString();
expectTypeOf(
  item._createDocumentLink(
    {},
    {
      label: null,
      relativeTo: null,
    },
  ),
).toBeString();

declare const mouseEvent: MouseEvent;
// this is typed by a fake overload, but does represent the average case
expectTypeOf(item._onClickDocumentLink(mouseEvent)).toEqualTypeOf<ClientDocument.OnClickDocumentLinkReturn>();

declare const storedItem: Item.Stored;
declare const aeCreateDataArray: ActiveEffect.CreateData[];
declare const aeUpdateDataArray: ActiveEffect.UpdateData[];
declare const createdAEs: ActiveEffect.Stored[];
declare const aeIDs: string[];
expectTypeOf(
  item["_preCreateDescendantDocuments"](
    storedItem, // cannot just be `item`
    "effects",
    aeCreateDataArray,
    { action: "create", modifiedTime: 0, render: false, renderSheet: false },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();
expectTypeOf(
  item["_onCreateDescendantDocuments"](
    storedItem,
    "effects",
    createdAEs,
    aeCreateDataArray,
    { action: "create", modifiedTime: 0, render: false, renderSheet: false, parent: item },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

expectTypeOf(
  item["_preUpdateDescendantDocuments"](
    storedItem, // cannot just be `item`
    "effects",
    aeUpdateDataArray,
    { action: "update", modifiedTime: 0, render: false, diff: true, recursive: true },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();
expectTypeOf(
  item["_onUpdateDescendantDocuments"](
    storedItem,
    "effects",
    createdAEs,
    aeUpdateDataArray,
    { action: "update", modifiedTime: 0, render: false, diff: true, recursive: true, parent: item },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

expectTypeOf(
  item["_preDeleteDescendantDocuments"](
    storedItem, // cannot just be `item`
    "effects",
    aeIDs,
    { action: "delete", modifiedTime: 0, render: false },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();
expectTypeOf(
  item["_onDeleteDescendantDocuments"](
    storedItem,
    "effects",
    createdAEs,
    aeIDs,
    { action: "delete", modifiedTime: 0, render: false, parent: item },
    "XXXXXSomeIDXXXXX",
  ),
).toBeVoid();

expectTypeOf(item["_onSheetChange"]()).toEqualTypeOf<Promise<void>>();
expectTypeOf(item["_onSheetChange"]({})).toEqualTypeOf<Promise<void>>();
expectTypeOf(item["_onSheetChange"]({ sheetOpen: true })).toEqualTypeOf<Promise<void>>();
expectTypeOf(item["_onSheetChange"]({ sheetOpen: undefined })).toEqualTypeOf<Promise<void>>();

expectTypeOf(item.deleteDialog()).toEqualTypeOf<Promise<Item.Stored | false | null | "yes">>();
expectTypeOf(item.deleteDialog({})).toEqualTypeOf<Promise<Item.Stored | false | null | "yes">>();
expectTypeOf(item.deleteDialog(dialogOptions)).toEqualTypeOf<Promise<Item.Stored | false | null | "yes">>();

// Using exportToJSON to test ToCompendiumOptions for now
expectTypeOf(item.exportToJSON()).toBeVoid();
expectTypeOf(item.exportToJSON({})).toBeVoid();
expectTypeOf(
  item.exportToJSON({
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
  item.exportToJSON({
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
  item.exportToJSON({
    clearFlags: undefined,
    clearFolder: undefined,
    clearOwnership: undefined,
    clearSort: undefined,
    clearSource: undefined,
    clearState: undefined,
    keepId: undefined,
  }),
).toBeVoid();

expectTypeOf(item.toDragData()).toEqualTypeOf<Item.DropData>();

expectTypeOf(item.importFromJSON(`{"foo":true}`)).toEqualTypeOf<Promise<typeof item>>();
expectTypeOf(item.importFromJSONDialog()).toEqualTypeOf<Promise<void>>();

// TODO: more thorough tests after `ToCompendiumReturnType` is rewritten or the v13 pass, whichever comes first
expectTypeOf(item.toCompendium()).toEqualTypeOf<ClientDocument.ToCompendiumReturnType<"Item", undefined>>();

declare const enrichmentAnchorOptions: TextEditor.EnrichmentAnchorOptions;
expectTypeOf(item.toAnchor()).toEqualTypeOf<HTMLAnchorElement>();
expectTypeOf(item.toAnchor({})).toEqualTypeOf<HTMLAnchorElement>();
expectTypeOf(item.toAnchor(enrichmentAnchorOptions)).toEqualTypeOf<HTMLAnchorElement>();

declare const enrichmentOptions: TextEditor.EnrichmentOptions;
declare const embedConfig: TextEditor.DocumentHTMLEmbedConfig;
expectTypeOf(item.toEmbed(embedConfig)).toEqualTypeOf<Promise<HTMLElement | null>>();
expectTypeOf(item.toEmbed(embedConfig, {})).toEqualTypeOf<Promise<HTMLElement | null>>();
expectTypeOf(item.toEmbed(embedConfig, enrichmentOptions)).toEqualTypeOf<Promise<HTMLElement | null>>();

expectTypeOf(item["_buildEmbedHTML"](embedConfig)).toEqualTypeOf<Promise<HTMLElement | HTMLCollection | null>>();
expectTypeOf(item["_buildEmbedHTML"](embedConfig, {})).toEqualTypeOf<Promise<HTMLElement | HTMLCollection | null>>();
expectTypeOf(item["_buildEmbedHTML"](embedConfig, enrichmentOptions)).toEqualTypeOf<
  Promise<HTMLElement | HTMLCollection | null>
>();

declare const element: HTMLElement;
declare const htmlCollection: HTMLCollection;

expectTypeOf(item["_createInlineEmbed"](element, embedConfig)).toEqualTypeOf<Promise<HTMLElement | null>>();
expectTypeOf(item["_createInlineEmbed"](htmlCollection, embedConfig)).toEqualTypeOf<Promise<HTMLElement | null>>();
expectTypeOf(item["_createInlineEmbed"](element, embedConfig, {})).toEqualTypeOf<Promise<HTMLElement | null>>();
expectTypeOf(item["_createInlineEmbed"](element, embedConfig, enrichmentOptions)).toEqualTypeOf<
  Promise<HTMLElement | null>
>();

expectTypeOf(item["_createFigureEmbed"](element, embedConfig)).toEqualTypeOf<Promise<HTMLElement | null>>();
expectTypeOf(item["_createFigureEmbed"](htmlCollection, embedConfig)).toEqualTypeOf<Promise<HTMLElement | null>>();
expectTypeOf(item["_createFigureEmbed"](element, embedConfig, {})).toEqualTypeOf<Promise<HTMLElement | null>>();
expectTypeOf(item["_createFigureEmbed"](element, embedConfig, enrichmentOptions)).toEqualTypeOf<
  Promise<HTMLElement | null>
>();

// omitting tests for deprecated _*EmbeddedDocuments methods
