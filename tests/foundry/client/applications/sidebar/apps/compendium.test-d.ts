import { expectTypeOf } from "vitest";
import type { AnyObject, DeepPartial } from "fvtt-types/utils";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import Compendium = foundry.applications.sidebar.apps.Compendium;
import CompendiumCollection = foundry.documents.collections.CompendiumCollection;
import ContextMenu = foundry.applications.ux.ContextMenu;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;

declare const compendium: Compendium<Actor.ImplementationClass>;

expectTypeOf(compendium).toExtend<DocumentDirectory.Any>();

expectTypeOf(Compendium.PARTS).toEqualTypeOf<Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>>();
expectTypeOf(Compendium["_entryPartial"]).toBeString();

// Narrowed from the base's `DirectoryCollectionMixin.AnyMixed` — a compendium directory is always backed by a pack.
expectTypeOf(compendium.collection).toEqualTypeOf<CompendiumCollection.Any>();

expectTypeOf(compendium.isPopout).toBeBoolean();
expectTypeOf(compendium.title).toBeString();

declare const configuration: DeepPartial<Compendium.Configuration>;
declare const options: DeepPartial<Compendium.RenderOptions>;

expectTypeOf(compendium["_initializeApplicationOptions"](configuration)).toEqualTypeOf<Compendium.Configuration>();

expectTypeOf(compendium["_canCreateEntry"]()).toBeBoolean();
expectTypeOf(compendium["_canCreateFolder"]()).toBeBoolean();
expectTypeOf(compendium["_canRender"](options)).toEqualTypeOf<false | void>();
expectTypeOf(compendium["_configureRenderOptions"](options)).toBeVoid();

expectTypeOf(compendium["_getEntryContextOptions"]()).toEqualTypeOf<ContextMenu.Entry<HTMLElement>[]>();
expectTypeOf(compendium["_getFolderContextOptions"]()).toEqualTypeOf<ContextMenu.Entry<HTMLElement>[]>();
expectTypeOf(compendium["_getFrameButtons"](options)).toEqualTypeOf<ApplicationV2.HeaderControlsEntry[]>();

declare const context: DeepPartial<Compendium.RenderContext>;
declare const partContext: ApplicationV2.RenderContext;
declare const partOptions: HandlebarsApplicationMixin.RenderOptions;

expectTypeOf(compendium["_prepareHeaderContext"](partContext, partOptions)).toEqualTypeOf<Promise<void>>();
expectTypeOf(compendium["_onRender"](context, options)).toEqualTypeOf<Promise<void>>();

declare const event: PointerEvent;
declare const target: HTMLElement;

expectTypeOf(compendium["_onClickEntry"](event, target)).toEqualTypeOf<Promise<void>>();
expectTypeOf(compendium["_onClickEntry"](event, target, { _skipDeprecation: true })).toEqualTypeOf<Promise<void>>();

// Declared at the inherited width. For an `Adventure` pack the promise actually resolves to the exporter
// application, which is not assignable to it — see the `@privateRemarks` on the declaration.
expectTypeOf(compendium["_onCreateEntry"](event, target)).toEqualTypeOf<Promise<Actor.Implementation | null>>();

expectTypeOf(compendium["_canDragDrop"](".directory-list")).toBeBoolean();

declare const actor: Actor.Implementation;
expectTypeOf(compendium["_entryAlreadyExists"](actor)).toBeBoolean();
expectTypeOf(compendium["_getEntryDragData"]("entryId")).toEqualTypeOf<AnyObject>();

// A pack, or a pack collection name resolved to the pack during `_initializeApplicationOptions`.
expectTypeOf<Compendium.Configuration["collection"]>().toEqualTypeOf<CompendiumCollection.Any | string>();
