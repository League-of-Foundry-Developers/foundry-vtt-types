import { expectTypeOf } from "vitest";
import type { AnyObject, DeepPartial, MaybePromise } from "fvtt-types/utils";

import AbstractSidebarTab = foundry.applications.sidebar.AbstractSidebarTab;
import CompendiumCollection = foundry.documents.collections.CompendiumCollection;
import CompendiumDirectory = foundry.applications.sidebar.tabs.CompendiumDirectory;
import CompendiumPacks = foundry.documents.collections.CompendiumPacks;
import ContextMenu = foundry.applications.ux.ContextMenu;
import DocumentIndex = foundry.helpers.DocumentIndex;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;

declare const directory: CompendiumDirectory;

expectTypeOf(directory).toExtend<AbstractSidebarTab.Any>();

// Widened from the `"compendium"` literal so a subclass can occupy its own sidebar tab.
expectTypeOf(CompendiumDirectory.tabName).toBeString();
expectTypeOf(CompendiumDirectory.PARTS).toEqualTypeOf<
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

expectTypeOf(directory.activeFilters).toEqualTypeOf<Set<string>>();

expectTypeOf(directory["_getEntryContextOptions"]()).toEqualTypeOf<ContextMenu.Entry<HTMLElement>[]>();
expectTypeOf(directory["_getFilterContextOptions"]()).toEqualTypeOf<ContextMenu.Entry<HTMLElement>[]>();
expectTypeOf(directory["_getFolderContextOptions"]()).toEqualTypeOf<ContextMenu.Entry<HTMLElement>[]>();

declare const context: DeepPartial<CompendiumDirectory.RenderContext>;
declare const options: DeepPartial<CompendiumDirectory.RenderOptions>;
expectTypeOf(directory["_onFirstRender"](context, options)).toEqualTypeOf<Promise<void>>();
expectTypeOf(directory["_onRender"](context, options)).toEqualTypeOf<Promise<void>>();
expectTypeOf(directory["_prepareContext"]({ ...options, isFirstRender: true })).toEqualTypeOf<
  Promise<CompendiumDirectory.RenderContext>
>();

declare const partContext: CompendiumDirectory.RenderContext;
declare const partOptions: HandlebarsApplicationMixin.RenderOptions;
expectTypeOf(directory["_prepareDirectoryContext"](partContext, partOptions)).toEqualTypeOf<Promise<void>>();
expectTypeOf(directory["_prepareHeaderContext"](partContext, partOptions)).toEqualTypeOf<Promise<void>>();

declare const pack: CompendiumCollection.Any;
expectTypeOf(directory["_preparePackContext"](pack)).toEqualTypeOf<CompendiumDirectory.PackContext>();

expectTypeOf(directory.collapseAll()).toBeVoid();

declare const pointerEvent: PointerEvent;
declare const target: HTMLElement;
expectTypeOf(directory["_onClickEntry"](pointerEvent, target)).toBeVoid();
expectTypeOf(directory["_onCreateEntry"](pointerEvent, target)).toEqualTypeOf<Promise<void>>();
expectTypeOf(directory["_onCreateFolder"](pointerEvent, target)).toBeVoid();
expectTypeOf(directory["_onToggleFolder"](pointerEvent, target)).toBeVoid();

expectTypeOf(directory["_onDeleteCompendium"](target)).toEqualTypeOf<Promise<void>>();
expectTypeOf(directory["_onDuplicateCompendium"](target)).toEqualTypeOf<Promise<CompendiumCollection.Any | void>>();
// Foundry declares `Promise<boolean|void>`, but the resolved value comes from `_onDuplicateCompendium`.
expectTypeOf(directory["_onToggleLock"](target)).toEqualTypeOf<Promise<CompendiumCollection.Any | void>>();

expectTypeOf(directory["_onToggleCompendiumFilterType"](pointerEvent, "Actor")).toEqualTypeOf<
  Promise<CompendiumDirectory>
>();
expectTypeOf(directory["_onToggleCompendiumFilterType"](pointerEvent, null)).toEqualTypeOf<
  Promise<CompendiumDirectory>
>();
expectTypeOf(directory["_onToggleCompendiumFilterType"](pointerEvent)).toEqualTypeOf<Promise<CompendiumDirectory>>();

declare const packs: Set<string>;
declare const folderIds: Set<string>;
declare const autoExpandIds: Set<string>;
declare const rgx: RegExp;
declare const keyboardEvent: KeyboardEvent;
expectTypeOf(directory["_onSearchFilter"](keyboardEvent, "query", rgx, target)).toBeVoid();
expectTypeOf(directory["_onMatchSearchEntry"]("query", packs, target)).toBeVoid();
expectTypeOf(directory["_matchSearchCompendiums"](rgx, packs, folderIds, autoExpandIds)).toBeVoid();
expectTypeOf(directory["_matchSearchFolders"](rgx, folderIds, autoExpandIds)).toBeVoid();

declare const documents: Set<DocumentIndex.AnyIndexedDocument>;
expectTypeOf(directory["_matchSearchDocuments"]("query", documents)).toBeVoid();
expectTypeOf(directory["_onMatchSearchDocuments"](documents, target)).toBeVoid();

expectTypeOf(directory["_canDragDrop"](".directory-list")).toBeBoolean();
expectTypeOf(directory["_canDragStart"](".directory-item")).toBeBoolean();
expectTypeOf(directory["_entryAlreadyExists"](pack)).toBeBoolean();
expectTypeOf(directory["_entryBelongsToFolder"](pack, "folderId")).toBeBoolean();
expectTypeOf(directory["_entryBelongsToFolder"](pack, undefined)).toBeBoolean();

// Synchronous at runtime, despite Foundry's `@returns {Promise<...>}`; the caller awaits it, so the
// declaration stays wide enough for an async override.
declare const dropData: AnyObject;
expectTypeOf(directory["_getDroppedEntryFromData"](dropData)).toEqualTypeOf<
  MaybePromise<CompendiumCollection.Any | undefined>
>();
expectTypeOf(directory["_getEntryDragData"]("world.mypack")).toEqualTypeOf<CompendiumDirectory.EntryDragData>();
expectTypeOf(directory["_getFolderDragData"]("folderId")).toEqualTypeOf<
  foundry.abstract.Document.DropDataFor<"Folder">
>();

expectTypeOf(directory["_handleDroppedEntry"](target, dropData)).toEqualTypeOf<Promise<void>>();
expectTypeOf(directory["_handleDroppedEntry"](null, dropData)).toEqualTypeOf<Promise<void>>();
expectTypeOf(directory["_handleDroppedFolder"](target, dropData)).toEqualTypeOf<Promise<void>>();

declare const dragEvent: DragEvent;
expectTypeOf(directory["_onDragHighlight"](dragEvent)).toBeVoid();
expectTypeOf(directory["_onDragOver"](dragEvent)).toBeVoid();
expectTypeOf(directory["_onDragStart"](dragEvent)).toBeVoid();
expectTypeOf(directory["_onDragDocumentStart"](dragEvent)).toBeVoid();
expectTypeOf(directory["_onDrop"](dragEvent)).toEqualTypeOf<Promise<void> | void>();

declare const sortData: CompendiumDirectory.SortRelativeData;
expectTypeOf(directory["_sortRelative"](pack, sortData)).toBeVoid();

// Present on every render.
expectTypeOf<CompendiumDirectory.RenderContext["documentName"]>().toBeString();
expectTypeOf<CompendiumDirectory.RenderContext["folderIcon"]>().toBeString();

// Added by the directory part.
expectTypeOf<CompendiumDirectory.RenderContext["packContext"]>().toEqualTypeOf<
  Record<string, CompendiumDirectory.PackContext> | undefined
>();
expectTypeOf<CompendiumDirectory.RenderContext["tree"]>().toEqualTypeOf<CompendiumPacks["tree"] | undefined>();

// Added by the header part.
expectTypeOf<CompendiumDirectory.RenderContext["searchMode"]>().toEqualTypeOf<
  CompendiumDirectory.SearchModeContext | undefined
>();
expectTypeOf<CompendiumDirectory.RenderContext["filtersActive"]>().toEqualTypeOf<number | undefined>();

// `0` rather than `false` while no filter is active — the runtime returns the filter count directly.
expectTypeOf<CompendiumDirectory.PackContext["hidden"]>().toEqualTypeOf<boolean | 0>();
expectTypeOf<CompendiumDirectory.PackContext["icon"]>().toEqualTypeOf<string | undefined>();
expectTypeOf<CompendiumDirectory.PackContext["banner"]>().toEqualTypeOf<string | null | undefined>();
