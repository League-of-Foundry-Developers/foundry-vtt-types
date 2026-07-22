import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import CompendiumDirectory = foundry.applications.sidebar.tabs.CompendiumDirectory;
import ContextMenu = foundry.applications.ux.ContextMenu;
import ApplicationV2 = foundry.applications.api.ApplicationV2;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;
import CompendiumCollection = foundry.documents.collections.CompendiumCollection;

const directory = new CompendiumDirectory();

expectTypeOf(CompendiumDirectory.DEFAULT_OPTIONS).toEqualTypeOf<CompendiumDirectory.DefaultOptions>();
expectTypeOf(CompendiumDirectory.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(CompendiumDirectory.tabName).toEqualTypeOf<"compendium">();

expectTypeOf(directory.activeFilters).toEqualTypeOf<Set<string>>();
expectTypeOf(directory.collapseAll()).toEqualTypeOf<void>();

declare class _TestCompendiumDirectorySubclass extends CompendiumDirectory {
  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];

  protected override _getFilterContextOptions(): ContextMenu.Entry<HTMLElement>[];

  protected override _getFolderContextOptions(): ContextMenu.Entry<HTMLElement>[];

  protected override _onFirstRender(
    context: DeepPartial<CompendiumDirectory.RenderContext>,
    options: DeepPartial<CompendiumDirectory.RenderOptions>,
  ): Promise<void>;

  protected override _onRender(
    context: DeepPartial<CompendiumDirectory.RenderContext>,
    options: DeepPartial<CompendiumDirectory.RenderOptions>,
  ): Promise<void>;

  protected override _prepareContext(
    options: DeepPartial<CompendiumDirectory.RenderOptions>,
  ): Promise<CompendiumDirectory.RenderContext>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<CompendiumDirectory.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  protected override _prepareDirectoryContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<CompendiumDirectory.RenderOptions>,
  ): Promise<void>;

  protected override _prepareHeaderContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<CompendiumDirectory.RenderOptions>,
  ): Promise<void>;

  protected override _preparePackContext(
    pack: CompendiumCollection.Any,
  ): CompendiumDirectory.CompendiumPackDirectoryContext;

  protected override _preSyncPartState(
    partId: string,
    newElement: HTMLElement,
    priorElement: HTMLElement,
    state: DocumentDirectory.PartState,
  ): void;

  protected override _syncPartState(
    partId: string,
    newElement: HTMLElement,
    priorElement: HTMLElement,
    state: DocumentDirectory.PartState,
  ): void;

  protected override _onClickEntry(event: PointerEvent, target: HTMLElement): void;

  protected override _onCreateEntry(event: PointerEvent, target: HTMLElement): Promise<void>;

  protected override _onCreateFolder(event: PointerEvent, target: HTMLElement): void;

  protected override _onDeleteCompendium(li: HTMLElement): Promise<void>;

  protected override _onDuplicateCompendium(li: HTMLElement): Promise<CompendiumCollection.Any | void>;

  protected override _onToggleCompendiumFilterType(event: PointerEvent, type?: string | null): Promise<this>;

  protected override _onToggleFolder(event: PointerEvent, target: HTMLElement): void;

  protected override _onToggleLock(li: HTMLElement): Promise<CompendiumCollection.Any | void>;

  protected override _onMatchSearchEntry(
    query: string,
    packs: Set<string>,
    element: HTMLElement,
    options?: Record<string, unknown>,
  ): void;

  protected override _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;

  protected override _matchSearchCompendiums(
    query: RegExp,
    packs: Set<string>,
    folderIds: Set<string>,
    autoExpandIds: Set<string>,
    options?: Record<string, unknown>,
  ): void;

  protected override _matchSearchFolders(
    query: RegExp,
    folderIds: Set<string>,
    autoExpandIds: Set<string>,
    options?: Record<string, unknown>,
  ): void;

  protected override _matchSearchDocuments(query: string, documents: Set<foundry.abstract.Document.Any>): void;

  protected override _onMatchSearchDocuments(
    indexEntries: Set<foundry.abstract.Document.Any>,
    listEl: HTMLElement,
  ): void;

  protected override _canDragDrop(selector: string): boolean;

  protected override _canDragStart(selector: string): boolean;

  protected override _entryAlreadyExists(pack: CompendiumCollection.Any): boolean;

  protected override _entryBelongsToFolder(pack: CompendiumCollection.Any, folder: string | undefined): boolean;

  protected override _getDroppedEntryFromData(data: Record<string, unknown>): CompendiumCollection.Any | undefined;

  protected override _getEntryDragData(collection: string): CompendiumDirectory.CompendiumDropData;

  protected override _getFolderDragData(folderId: string): Folder.DropData;

  protected override _handleDroppedEntry(target: HTMLElement | null, data: Record<string, unknown>): Promise<void>;

  protected override _handleDroppedFolder(target: HTMLElement | null, data: Record<string, unknown>): Promise<void>;

  protected override _onDragHighlight(event: DragEvent): void;

  protected override _onDragOver(event: DragEvent): void;

  protected override _onDragStart(event: DragEvent): void;

  protected override _onDragDocumentStart(event: DragEvent): void;

  protected override _onDrop(event: DragEvent): Promise<void> | undefined;

  protected override _sortRelative(pack: CompendiumCollection.Any, sortData: Record<string, unknown>): void;
}

expectTypeOf(directory).toEqualTypeOf<CompendiumDirectory>();
