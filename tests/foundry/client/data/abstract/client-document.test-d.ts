import { expectTypeOf } from "vitest";
import ApplicationV2 = foundry.applications.api.ApplicationV2;
import Document = foundry.abstract.Document;
import type { FixedInstanceType, MaybePromise } from "../../../../../src/utils/index.d.mts";

const item = new Item.implementation({ name: "foo", type: "base" });

// Test the inheritance
expectTypeOf(item.documentName).toEqualTypeOf<"Item">(); // Document
expectTypeOf(item.migrateSystemData()).toEqualTypeOf<object>(); // Base-Document
expectTypeOf(item.uuid).toEqualTypeOf<string>(); // ClientDocumentMixin
expectTypeOf(item.transferredEffects).toEqualTypeOf<ActiveEffect.Implementation[]>(); // class itself

// Test the inheritance of static members
expectTypeOf(Item.documentName).toEqualTypeOf<"Item">(); // Document
expectTypeOf(Item.createDialog()).toEqualTypeOf<Promise<Item.Implementation | null | undefined>>(); // ClientDocumentMixin

// Properties
declare const someApp: Application.Any;
declare const someAppV2: ApplicationV2.Any;

expectTypeOf(item.apps).toEqualTypeOf<Record<string, Application.Any | ApplicationV2.Any>>();
item.apps.foo = someApp;
item.apps.bar = someAppV2;
// @ts-expect-error apps is readonly
item.apps = { foo: someApp, bar: someAppV2 };

expectTypeOf(item["_sheet"]).toEqualTypeOf<FixedInstanceType<Document.ConfiguredSheetClassFor<"Item">> | null>();

// _initialize overridden with no signature changes

// TODO This will also match `Item`, but not `Item.Implementation`
expectTypeOf(item.collection).toEqualTypeOf<Collection<typeof item>>();
// @ts-expect-error Only getter, no setter
item.collection = new Collection<typeof item>();

// TODO: This appears to be `undefined` in all cases, look into the conditional type on this getter
expectTypeOf(item.compendium).toEqualTypeOf<undefined>();
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

expectTypeOf(item.permission).toEqualTypeOf<CONST.DOCUMENT_OWNERSHIP_LEVELS>();
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
expectTypeOf(item.render(true, { window: { title: "foo" } })).toBeVoid();

declare const sortOptions: SortingHelpers.SortOptions<typeof item>;
declare const updateData: Item.UpdateData;
expectTypeOf(item.sortRelative()).toEqualTypeOf<Promise<typeof item>>();
expectTypeOf(item.sortRelative({})).toEqualTypeOf<Promise<typeof item>>();
expectTypeOf(item.sortRelative({ updateData, ...sortOptions })).toEqualTypeOf<Promise<typeof item>>();

declare const actor: Actor.Implementation;
expectTypeOf(item.getRelativeUUID(actor)).toBeString();

// The first argument is unused in core except in JournalEntryPage
expectTypeOf(item._createDocumentLink()).toBeString();
expectTypeOf(item._createDocumentLink({})).toBeString();
expectTypeOf(item._createDocumentLink(null)).toBeString();
expectTypeOf(item._createDocumentLink(null, {})).toBeString();
expectTypeOf(
  item._createDocumentLink(undefined, {
    label: "Some Label",
    relativeTo: actor,
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
expectTypeOf(item._onClickDocumentLink(mouseEvent)).toEqualTypeOf<MaybePromise<NonNullable<(typeof item)["sheet"]>>>();

// ensure source can be used to create a new document with createDialog
expectTypeOf(Item.createDialog(item.toObject())).toEqualTypeOf<Promise<Item.Implementation | null | undefined>>();
