import { expectTypeOf } from "vitest";
import type { AnyMutableObject, AnyObject, DeepPartial, MaybePromise } from "fvtt-types/utils";

import AbstractSidebarTab = foundry.applications.sidebar.AbstractSidebarTab;
import ContextMenu = foundry.applications.ux.ContextMenu;
import DirectoryCollectionMixin = foundry.documents.abstract.DirectoryCollectionMixin;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;

declare const directory: DocumentDirectory<Actor.ImplementationClass>;

expectTypeOf(directory).toExtend<AbstractSidebarTab.Any>();

expectTypeOf(DocumentDirectory.PARTS).toEqualTypeOf<
  Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(DocumentDirectory["_entryPartial"]).toBeString();
expectTypeOf(DocumentDirectory["_folderPartial"]).toBeString();

expectTypeOf(directory.collection).toEqualTypeOf<DirectoryCollectionMixin.AnyMixed>();
expectTypeOf(directory.documentClass).toEqualTypeOf<Actor.ImplementationClass>();
expectTypeOf(directory.documentName).toBeString();
expectTypeOf(directory.title).toBeString();

expectTypeOf(directory.collapseAll()).toBeVoid();

expectTypeOf(directory["_canCreateEntry"]()).toBeBoolean();
expectTypeOf(directory["_canCreateFolder"]()).toBeBoolean();
expectTypeOf(directory["_canDragStart"](".directory-item")).toBeBoolean();
expectTypeOf(directory["_canDragDrop"](".directory-list")).toBeBoolean();

// Both context-menu builders return V14-shaped entries — `label` / `onClick` / `visible`.
expectTypeOf(directory["_getEntryContextOptions"]()).toEqualTypeOf<ContextMenu.Entry<HTMLElement>[]>();
expectTypeOf(directory["_getFolderContextOptions"]()).toEqualTypeOf<ContextMenu.Entry<HTMLElement>[]>();
expectTypeOf(DocumentDirectory["_getFolderContextOptions"]()).toEqualTypeOf<ContextMenu.Entry<HTMLElement>[]>();
expectTypeOf(directory["_createContextMenus"]()).toBeVoid();

declare const actor: Actor.Implementation;
expectTypeOf(directory["_prepareDuplicateData"](actor)).toEqualTypeOf<AnyMutableObject>();
expectTypeOf(directory["_entryAlreadyExists"](actor)).toBeBoolean();
expectTypeOf(directory["_entryBelongsToFolder"](actor, "folderId")).toBeBoolean();
expectTypeOf(directory["_entryBelongsToFolder"](actor, null)).toBeBoolean();

// A compendium directory iterates index records rather than documents, so both satisfy `Entry`.
declare const indexEntry: DocumentDirectory.IndexEntry;
expectTypeOf(directory["_entryBelongsToFolder"](indexEntry, null)).toBeBoolean();

declare const dropData: AnyObject;
expectTypeOf(directory["_getDroppedEntryFromData"](dropData)).toEqualTypeOf<Promise<Actor.Implementation>>();
expectTypeOf(directory["_createDroppedEntry"](actor)).toEqualTypeOf<Promise<Actor.Implementation>>();
expectTypeOf(directory["_createDroppedEntry"](actor, { folder: null })).toEqualTypeOf<Promise<Actor.Implementation>>();
expectTypeOf(directory["_getEntryDragData"]("entryId")).toEqualTypeOf<AnyObject>();
expectTypeOf(directory["_getFolderDragData"]("folderId")).toEqualTypeOf<AnyObject>();

declare const folder: Folder.Implementation;
expectTypeOf(directory["_createDroppedFolderContent"](folder)).toEqualTypeOf<Promise<Folder.Implementation[]>>();
expectTypeOf(directory["_createDroppedFolderContent"](folder, folder)).toEqualTypeOf<
  Promise<Folder.Implementation[]>
>();
expectTypeOf(directory["_createDroppedFolderDocuments"](folder, [actor])).toEqualTypeOf<Promise<void>>();
// Synchronous at runtime, despite Foundry's `@returns {Promise<…>}`; the caller awaits it, so the
// declaration stays wide enough for an async override.
expectTypeOf(directory["_organizeDroppedFoldersAndDocuments"](folder)).toEqualTypeOf<
  MaybePromise<DocumentDirectory.OrganizedDroppedFolder<Actor.ImplementationClass>>
>();

declare const sortData: AnyObject;
expectTypeOf(directory["_handleDroppedForeignFolder"](folder, "folderId", sortData)).toEqualTypeOf<
  Promise<DocumentDirectory.DroppedForeignFolder | null>
>();

declare const target: HTMLElement;
expectTypeOf(directory["_handleDroppedEntry"](target, dropData)).toEqualTypeOf<Promise<void>>();
expectTypeOf(directory["_handleDroppedEntry"](null, dropData)).toEqualTypeOf<Promise<void>>();
expectTypeOf(directory["_handleDroppedFolder"](target, dropData)).toEqualTypeOf<Promise<void>>();

declare const config: DocumentDirectory.HandleDroppedFolderConfig;
expectTypeOf(DocumentDirectory["_handleDroppedFolder"](target, dropData, config)).toEqualTypeOf<
  Promise<DocumentDirectory.HandleDroppedFolderResult | void>
>();

declare const pointerEvent: PointerEvent;
declare const dragEvent: DragEvent;
expectTypeOf(directory["_onClickEntry"](pointerEvent, target)).toEqualTypeOf<Promise<void>>();
expectTypeOf(directory["_onCreateFolder"](pointerEvent, target)).toBeVoid();
expectTypeOf(directory["_onToggleFolder"](pointerEvent, target)).toBeVoid();
expectTypeOf(directory["_onDragHighlight"](dragEvent)).toBeVoid();
expectTypeOf(directory["_onDragOver"](dragEvent)).toBeVoid();
expectTypeOf(directory["_onDragStart"](dragEvent)).toBeVoid();
expectTypeOf(directory["_onDrop"](dragEvent)).toEqualTypeOf<Promise<void> | void>();

declare const entryIds: Set<string>;
declare const folderIds: Set<string>;
declare const autoExpandIds: Set<string>;
declare const rgx: RegExp;
declare const keyboardEvent: KeyboardEvent;
expectTypeOf(directory["_onSearchFilter"](keyboardEvent, "query", rgx, target)).toBeVoid();
expectTypeOf(directory["_onMatchSearchEntry"]("query", entryIds, target)).toBeVoid();
expectTypeOf(directory["_matchSearchEntries"](rgx, entryIds, folderIds, autoExpandIds)).toBeVoid();
expectTypeOf(directory["_matchSearchFolders"](rgx, folderIds, autoExpandIds)).toBeVoid();

declare const context: DeepPartial<DocumentDirectory.RenderContext>;
declare const options: DeepPartial<DocumentDirectory.RenderOptions>;
expectTypeOf(directory["_onFirstRender"](context, options)).toEqualTypeOf<Promise<void>>();
expectTypeOf(directory["_onRender"](context, options)).toEqualTypeOf<Promise<void>>();
expectTypeOf(directory["_canRender"](options)).toEqualTypeOf<false | void>();

// The render context the directory adds on top of the sidebar tab's.
expectTypeOf<DocumentDirectory.RenderContext["documentName"]>().toBeString();
expectTypeOf<DocumentDirectory.RenderContext["folderIcon"]>().toBeString();
expectTypeOf<DocumentDirectory.RenderContext["sidebarIcon"]>().toBeString();
expectTypeOf<DocumentDirectory.RenderContext["canCreateEntry"]>().toBeBoolean();
expectTypeOf<DocumentDirectory.RenderContext["canCreateFolder"]>().toBeBoolean();

// `_initializeApplicationOptions` resolves a collection name into the collection itself, so both forms
// are accepted in configuration.
expectTypeOf<DocumentDirectory.Configuration["collection"]>().toEqualTypeOf<
  DirectoryCollectionMixin.AnyMixed | string
>();
expectTypeOf<DocumentDirectory.Configuration["renderUpdateKeys"]>().toEqualTypeOf<string[]>();

// Deprecated since v13, until v15.
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(directory["_onClickEntryName"](pointerEvent)).toEqualTypeOf<Promise<void>>();
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(directory["_toggleFolder"](pointerEvent)).toBeVoid();
