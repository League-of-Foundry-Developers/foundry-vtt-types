import type { AnyObject, DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type AbstractSidebarTab from "../sidebar-tab.d.mts";
import type ContextMenu from "../../ux/context-menu.d.mts";
import type DocumentDirectory from "../document-directory.d.mts";
import type CompendiumCollection from "#client/documents/collections/compendium-collection.d.mts";
import type CompendiumPacks from "#client/documents/collections/compendium-packs.d.mts";

import Document = foundry.abstract.Document;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      CompendiumDirectory: CompendiumDirectory.Any;
    }
  }
}

/**
 * The listing of compendiums available in the World.
 */
declare class CompendiumDirectory<
  RenderContext extends CompendiumDirectory.RenderContext = CompendiumDirectory.RenderContext,
  Configuration extends CompendiumDirectory.Configuration = CompendiumDirectory.Configuration,
  RenderOptions extends CompendiumDirectory.RenderOptions = CompendiumDirectory.RenderOptions,
> extends HandlebarsApplicationMixin(AbstractSidebarTab)<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["directory", "flexcol"],
   *   window: {
   *     title: "SIDEBAR.TabCompendium"
   *   },
   *   actions: {
   *     activateEntry: CompendiumDirectory.#onClickEntry,
   *     collapseFolders: CompendiumDirectory.#onCollapseFolders,
   *     createEntry: CompendiumDirectory.#onCreateEntry,
   *     createFolder: CompendiumDirectory.#onCreateFolder,
   *     toggleFolder: CompendiumDirectory.#onToggleFolder,
   *     toggleSort: CompendiumDirectory.#onToggleSort,
   *     openDocumentSheet: CompendiumDirectory.#onOpenDocumentSheet
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: CompendiumDirectory.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   header: {
   *     template: "templates/sidebar/tabs/compendiums.hbs"
   *   },
   *   directory: {
   *     template: "templates/sidebar/directory/directory.hbs",
   *     templates: [
   *       "templates/sidebar/partials/folder-partial.hbs",
   *       "templates/sidebar/partials/pack-partial.hbs",
   *       "templates/sidebar/partials/document-match.hbs"
   *     ],
   *     scrollable: [""]
   *   },
   *   footer: {
   *     template: "templates/sidebar/directory/footer.hbs"
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  static override tabName: "compendium";

  /**
   * The set of active document type filters.
   */
  get activeFilters(): Set<string>;

  /**
   * Get context menu entries for entries in this directory.
   */
  protected _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];

  /**
   * Get options for filtering the directory by document type.
   */
  protected _getFilterContextOptions(): ContextMenu.Entry<HTMLElement>[];

  /**
   * Get context menu entries for folders in this directory.
   */
  protected _getFolderContextOptions(): ContextMenu.Entry<HTMLElement>[];

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare render context for the directory part.
   * @param context - Shared context provided by _prepareContext
   * @param options - Options which configure application rendering behavior
   */
  protected _prepareDirectoryContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  /**
   * Prepare render context for the header part.
   * @param context - Shared context provided by _prepareContext
   * @param options - Options which configure application rendering behavior
   */
  protected _prepareHeaderContext(
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  /**
   * Prepare render context for an individual compendium pack.
   * @param pack - The compendium pack.
   */
  protected _preparePackContext(pack: CompendiumCollection.Any): CompendiumDirectory.CompendiumPackDirectoryContext;

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

  /**
   * Collapse all open folders in this directory.
   */
  collapseAll(): void;

  /**
   * Handle clicking on a compendium entry.
   * @param event  - The triggering event.
   * @param target - The action target.
   */
  protected _onClickEntry(event: PointerEvent, target: HTMLElement): void;

  /**
   * Handle creating a new compendium pack.
   * @param event  - The triggering event.
   * @param target - The action target.
   */
  protected _onCreateEntry(event: PointerEvent, target: HTMLElement): Promise<void>;

  /**
   * Handle creating a new folder in this directory.
   * @param event  - The triggering click event.
   * @param target - The action target element.
   */
  protected _onCreateFolder(event: PointerEvent, target: HTMLElement): void;

  /**
   * Handle deleting a compendium pack.
   * @param li - The compendium target element.
   */
  protected _onDeleteCompendium(li: HTMLElement): Promise<void>;

  /**
   * Handle duplicating a compendium.
   * @param li - The compendium target element.
   */
  protected _onDuplicateCompendium(li: HTMLElement): Promise<CompendiumCollection.Any | void>;

  /**
   * Handle toggling a compendium type filter.
   * @param event - The triggering event.
   * @param type  - The compendium type to filter by. If omitted, clear all filters.
   */
  protected _onToggleCompendiumFilterType(event: PointerEvent, type?: string | null): Promise<this>;

  /**
   * Handle toggling a folder's expanded state.
   * @param event  - The triggering click event.
   * @param target - The action target element.
   */
  protected _onToggleFolder(event: PointerEvent, target: HTMLElement): void;

  /**
   * Handle toggling locked state on a compendium.
   * @param li - The compendium target element.
   * @remarks Foundry's JSDoc claims this returns `Promise<boolean|void>`, but no code path ever
   * resolves to a `boolean`; it resolves to whatever {@linkcode CompendiumCollection.configure | #configure}
   * or {@linkcode CompendiumDirectory._onDuplicateCompendium | #_onDuplicateCompendium} resolves to, or `undefined`.
   */
  protected _onToggleLock(li: HTMLElement): Promise<CompendiumCollection.Any | void>;

  /**
   * Handle matching a given directory entry with the search filter.
   * @param query    - The input search string.
   * @param packs    - The matched pack IDs.
   * @param element  - The candidate entry element.
   * @param options  - Additional options for subclass-specific behavior. (default: `{}`)
   */
  protected _onMatchSearchEntry(query: string, packs: Set<string>, element: HTMLElement, options?: AnyObject): void;

  /**
   * Handle directory searching and filtering.
   * @param event - The keyboard input event.
   * @param query - The input search string.
   * @param rgx   - The regular expression query that should be matched against.
   * @param html  - The container to filter entries from.
   */
  protected _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;

  /**
   * Identify entries in the collection which match a provided search query.
   * @param query         - The search query.
   * @param packs         - The set of matched pack IDs.
   * @param folderIds     - The set of matched folder IDs.
   * @param autoExpandIds - The set of folder IDs that should be auto-expanded.
   * @param options       - Additional options for subclass-specific behavior. (default: `{}`)
   */
  protected _matchSearchCompendiums(
    query: RegExp,
    packs: Set<string>,
    folderIds: Set<string>,
    autoExpandIds: Set<string>,
    options?: AnyObject,
  ): void;

  /**
   * Identify folders in the collection which match a provided search query.
   * @param query         - The search query.
   * @param folderIds     - The set of matched folder IDs.
   * @param autoExpandIds - The set of folder IDs that should be auto-expanded.
   * @param options       - Additional options for subclass-specific behavior. (default: `{}`)
   */
  protected _matchSearchFolders(
    query: RegExp,
    folderIds: Set<string>,
    autoExpandIds: Set<string>,
    options?: AnyObject,
  ): void;

  /**
   * Identify Document matches from DocumentIndex lookups and add to the provided Set.
   * @param query     - The user's search query
   * @param documents - The Document Set
   */
  protected _matchSearchDocuments(query: string, documents: Set<Document.Any>): void;

  /**
   * Render Document-search matches for display.
   * @param indexEntries - The matched Document index entries.
   * @param listEl       - The directory list element.
   */
  protected _onMatchSearchDocuments(indexEntries: Set<Document.Any>, listEl: HTMLElement): void;

  /**
   * Determine if the given user has permission to drop entries into the compendium directory.
   * @param selector - The CSS selector of the dragged element.
   */
  protected _canDragDrop(selector: string): boolean;

  /**
   * Determine if the given user has permission to drag packs and folders in the directory.
   * @param selector - The CSS selector of the target element.
   */
  protected _canDragStart(selector: string): boolean;

  /**
   * Test if the given pack is already present in this directory.
   * @param pack - The compendium pack.
   */
  protected _entryAlreadyExists(pack: CompendiumCollection.Any): boolean;

  /**
   * Determine whether a given directory entry belongs to the given folder.
   * @param pack   - The compendium pack.
   * @param folder - The target folder ID.
   */
  protected _entryBelongsToFolder(pack: CompendiumCollection.Any, folder: string | undefined): boolean;

  /**
   * Get the pack instance from its dropped data.
   * @param data - The drag data.
   */
  protected _getDroppedEntryFromData(data: AnyObject): CompendiumCollection.Any | undefined;

  /**
   * Get drag data for a compendium in this directory.
   * @param collection - The pack's collection ID.
   */
  protected _getEntryDragData(collection: string): CompendiumDirectory.CompendiumDropData;

  /**
   * Get drag data for a folder in this directory.
   * @param folderId - The folder ID.
   */
  protected _getFolderDragData(folderId: string): Folder.DropData;

  /**
   * Handle dropping a new pack into this directory.
   * @param target - The drop target element.
   * @param data   - The drop data.
   */
  protected _handleDroppedEntry(target: HTMLElement | null, data: AnyObject): Promise<void>;

  /**
   * Handle dropping a folder onto the directory.
   * @param target - The drop target element.
   * @param data   - The drop data.
   */
  protected _handleDroppedFolder(target: HTMLElement | null, data: AnyObject): Promise<void>;

  /**
   * Highlight folders as drop targets when a drag event enters or exits their area.
   * @param event - The in-progress drag event.
   */
  protected _onDragHighlight(event: DragEvent): void;

  /**
   * Handle drag events over the directory.
   */
  protected _onDragOver(event: DragEvent): void;

  protected _onDragStart(event: DragEvent): void;

  /**
   * Handle dragging a Document search result.
   */
  protected _onDragDocumentStart(event: DragEvent): void;

  protected _onDrop(event: DragEvent): Promise<void> | undefined;

  /**
   * Handle sorting a compendium pack relative to others in the directory.
   * @param pack     - The compendium pack.
   * @param sortData - Sort data.
   */
  protected _sortRelative(pack: CompendiumCollection.Any, sortData: AnyObject): void;

  #CompendiumDirectory: true;
}

declare namespace CompendiumDirectory {
  interface Any extends AnyCompendiumDirectory {}
  interface AnyConstructor extends Identity<typeof AnyCompendiumDirectory> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, AbstractSidebarTab.RenderContext {
    folderIcon: string;
    label: string;
    labelPlural: string;

    /** @remarks Honorary `documentName` for use in `DocumentDirectory` templates; always `"Compendium"` */
    documentName: string;

    sidebarIcon: string;

    /** @remarks Added by {@linkcode CompendiumDirectory._prepareDirectoryContext | #_prepareDirectoryContext} */
    canCreateEntry?: boolean | undefined;

    /** @remarks Added by {@linkcode CompendiumDirectory._prepareDirectoryContext | #_prepareDirectoryContext} */
    canCreateFolder?: boolean | undefined;

    /** @remarks Added by {@linkcode CompendiumDirectory._prepareDirectoryContext | #_prepareDirectoryContext} */
    entryPartial?: string | undefined;

    /** @remarks Added by {@linkcode CompendiumDirectory._prepareDirectoryContext | #_prepareDirectoryContext} */
    folderPartial?: string | undefined;

    /** @remarks Added by {@linkcode CompendiumDirectory._prepareDirectoryContext | #_prepareDirectoryContext} */
    packContext?: Record<string, CompendiumPackDirectoryContext> | undefined;

    /** @remarks Added by {@linkcode CompendiumDirectory._prepareDirectoryContext | #_prepareDirectoryContext} */
    maxFolderDepth?: number | undefined;

    /** @remarks Added by {@linkcode CompendiumDirectory._prepareDirectoryContext | #_prepareDirectoryContext} */
    tree?: CompendiumPacks["tree"] | undefined;

    /** @remarks Added by {@linkcode CompendiumDirectory._prepareHeaderContext | #_prepareHeaderContext} */
    filtersActive?: number | undefined;

    /** @remarks Added by {@linkcode CompendiumDirectory._prepareHeaderContext | #_prepareHeaderContext} */
    searchMode?: DocumentDirectory.SearchModeContext | undefined;

    /** @remarks Added by {@linkcode CompendiumDirectory._prepareHeaderContext | #_prepareHeaderContext} */
    sortMode?: DocumentDirectory.SortModeContext | undefined;
  }

  interface CompendiumPackDirectoryContext {
    /** Whether the pack is locked. */
    locked: boolean;

    /** Whether the pack has custom ownership configured. */
    customOwnership: boolean;

    /** The pack's collection ID. */
    collection: string;

    /** The name of the package the pack belongs to. */
    package: string;

    /** The pack title. */
    title: string;

    /**
     * An icon representing the pack's contents.
     * @remarks Foundry's JSDoc types this as a plain `string`, but it's only set if `CONFIG[documentName]` has a `sidebarIcon`
     */
    icon: string | undefined;

    /**
     * Whether the pack is currently hidden.
     * @remarks Foundry's JSDoc types this as a plain `boolean`, but if there are no active filters this is the
     * `Set`'s `size` (i.e. `0`), not `false`, due to `&&` short-circuiting
     */
    hidden: boolean | number;

    /**
     * The pack's banner image.
     * @remarks Foundry's JSDoc types this as a plain `string`, but it can be `null` or `undefined`
     */
    banner: string | null | undefined;

    /**
     * An icon representing the pack's source (World, System, or Module).
     * @remarks Foundry's JSDoc types this as a plain `string`, but it's only set if the package type has a matching entry
     */
    sourceIcon: string | undefined;

    /** CSS class names. */
    css: string;
  }

  interface CompendiumDropData {
    collection: string;
    type: "Compendium";
  }

  interface Configuration<CompendiumDirectory extends CompendiumDirectory.Any = CompendiumDirectory.Any>
    extends HandlebarsApplicationMixin.Configuration, AbstractSidebarTab.Configuration<CompendiumDirectory> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<CompendiumDirectory extends CompendiumDirectory.Any = CompendiumDirectory.Any> = DeepPartial<
    Configuration<CompendiumDirectory>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, AbstractSidebarTab.RenderOptions {}
}

declare abstract class AnyCompendiumDirectory extends CompendiumDirectory<
  CompendiumDirectory.RenderContext,
  CompendiumDirectory.Configuration,
  CompendiumDirectory.RenderOptions
> {
  constructor(...args: never);
}

export default CompendiumDirectory;
