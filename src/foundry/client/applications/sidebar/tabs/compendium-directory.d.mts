import type { AnyObject, DeepPartial, Identity, IntentionalPartial, MaybePromise } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type ContextMenu from "../../ux/context-menu.d.mts";
import type AbstractSidebarTab from "../sidebar-tab.d.mts";

import CompendiumCollection = foundry.documents.collections.CompendiumCollection;
import CompendiumPacks = foundry.documents.collections.CompendiumPacks;
import DocumentIndex = foundry.helpers.DocumentIndex;

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
  // Fake override.
  static override DEFAULT_OPTIONS: CompendiumDirectory.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /** @defaultValue `"compendium"` */
  static override tabName: string;

  /**
   * The set of active document type filters.
   *
   * @remarks Empty means unfiltered rather than "nothing shown".
   */
  get activeFilters(): Set<string>;

  /**
   * Get context menu entries for entries in this directory.
   *
   * @remarks Empty for non-GMs; deletion is limited to world packs.
   */
  protected _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];

  /**
   * Get options for filtering the directory by document type.
   *
   * @remarks Includes every compendium document type and a clear-all entry.
   */
  protected _getFilterContextOptions(): ContextMenu.Entry<HTMLElement>[];

  /**
   * Get context menu entries for folders in this directory.
   *
   * @remarks Includes only edit and remove entries.
   */
  protected _getFolderContextOptions(): ContextMenu.Entry<HTMLElement>[];

  /**
   * @remarks Binds menus and caches the document-match template.
   *
   * Fires the `getFolderContextOptions` and `getCompendiumContextOptions` hooks.
   */
  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  /** @remarks Rebinds search and drag-and-drop to their rendered parts. */
  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * @remarks Uses the synthetic document name `"Compendium"` for shared directory templates.
   */
  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare render context for the directory part.
   */
  protected _prepareDirectoryContext(
    context: CompendiumDirectory.RenderContext,
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Promise<void>;

  /**
   * Prepare render context for the header part.
   */
  protected _prepareHeaderContext(
    context: CompendiumDirectory.RenderContext,
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Promise<void>;

  /**
   * Prepare render context for an individual compendium pack.
   * @param pack - The compendium pack.
   */
  protected _preparePackContext(pack: CompendiumCollection.Any): CompendiumDirectory.PackContext;

  protected override _preSyncPartState(
    partId: string,
    newElement: HTMLElement,
    priorElement: HTMLElement,
    state: HandlebarsApplicationMixin.PartState,
  ): void;

  protected override _syncPartState(
    partId: string,
    newElement: HTMLElement,
    priorElement: HTMLElement,
    state: HandlebarsApplicationMixin.PartState,
  ): void;

  /**
   * @remarks Also clears the folders from {@linkcode game.folders._expanded}.
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
   *
   * @remarks Names the pack for its position in {@linkcode game.packs} when the dialog was submitted without one.
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
   *
   * @remarks A `null` type clears every filter; anything else toggles that one type.
   */
  protected _onToggleCompendiumFilterType(event: PointerEvent, type?: string | null): Promise<this>;

  /**
   * Handle toggling a folder's expanded state.
   * @param event  - The triggering click event.
   * @param target - The action target element.
   *
   * @remarks Collapsing a folder collapses every folder nested inside it.
   */
  protected _onToggleFolder(event: PointerEvent, target: HTMLElement): void;

  /**
   * Handle toggling locked state on a compendium.
   * @param li - The compendium target element.
   *
   * @remarks Unlocking may offer to duplicate the pack first.
   *
   * @privateRemarks Foundry's return type does not match the forwarded duplicate result.
   */
  protected _onToggleLock(li: HTMLElement): Promise<CompendiumCollection.Any | void>;

  /**
   * Handle matching a given directory entry with the search filter.
   * @param query   - The input search string.
   * @param packs   - The matched pack IDs.
   * @param element - The candidate entry element.
   * @param options - Additional options for subclass-specific behavior.
   */
  protected _onMatchSearchEntry(query: string, packs: Set<string>, element: HTMLElement, options?: AnyObject): void;

  /**
   * Handle directory searching and filtering.
   * @param event - The keyboard input event.
   * @param query - The input search string.
   * @param rgx   - The regular expression query that should be matched against.
   * @param html  - The container to filter entries from.
   *
   * @remarks Short queries show every entry without matching.
   */
  protected _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;

  /**
   * Identify entries in the collection which match a provided search query.
   * @param query         - The search query.
   * @param packs         - The set of matched pack IDs.
   * @param folderIds     - The set of matched folder IDs.
   * @param autoExpandIds - The set of folder IDs that should be auto-expanded.
   * @param options       - Additional options for subclass-specific behavior.
   *
   * @remarks Every pack inside an already-matched folder is matched too, without testing its own title.
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
   * @param options       - Additional options for subclass-specific behavior.
   *
   * @remarks A folder matched by name is not itself auto-expanded, though its ancestors are.
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
   *
   * @remarks Returns at most 25 visible documents matching the active filters.
   */
  protected _matchSearchDocuments(query: string, documents: Set<DocumentIndex.AnyIndexedDocument>): void;

  /**
   * Render Document-search matches for display.
   *
   * @remarks Replaces the previously rendered matches. The source row is hidden for a system pack.
   */
  protected _onMatchSearchDocuments(indexEntries: Set<DocumentIndex.AnyIndexedDocument>, listEl: HTMLElement): void;

  /**
   * Determine if the given user has permission to drop entries into the compendium directory.
   * @param selector - The CSS selector of the dragged element.
   *
   * @remarks Ignores `selector`: any drop is permitted for a GM, and refused otherwise.
   */
  protected _canDragDrop(selector: string): boolean;

  /**
   * Determine if the given user has permission to drag packs and folders in the directory.
   * @param selector - The CSS selector of the target element.
   *
   * @remarks Ignores `selector`: any drag is permitted for a GM, and refused otherwise.
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
   *
   * @remarks A pack with no folder belongs to the directory root, which an absent `folder` stands for.
   */
  protected _entryBelongsToFolder(pack: CompendiumCollection.Any, folder: string | undefined): boolean;

  /**
   * Get the pack instance from its dropped data.
   * @param data - The drag data.
   *
   * @privateRemarks Synchronous at runtime; widened because its caller awaits it.
   */
  protected _getDroppedEntryFromData(data: AnyObject): MaybePromise<CompendiumCollection.Any | undefined>;

  /**
   * Get drag data for a compendium in this directory.
   * @param collection - The pack's collection ID.
   */
  protected _getEntryDragData(collection: string): CompendiumDirectory.EntryDragData;

  /**
   * Get drag data for a folder in this directory.
   * @param folderId - The folder ID.
   */
  protected _getFolderDragData(folderId: string): foundry.abstract.Document.DropDataFor<"Folder">;

  /**
   * Handle dropping a new pack into this directory.
   * @param target - The drop target element.
   * @param data   - The drop data.
   *
   * @remarks Does nothing when the pack was dropped onto itself, or when it is not one of the installed packs.
   */
  protected _handleDroppedEntry(target: HTMLElement | null, data: AnyObject): Promise<void>;

  /**
   * Handle dropping a folder onto the directory.
   * @param target - The drop target element.
   * @param data   - The drop data.
   *
   * @remarks Ignores folders dragged from another world.
   */
  protected _handleDroppedFolder(target: HTMLElement | null, data: AnyObject): Promise<void>;

  /**
   * Highlight folders as drop targets when a drag event enters or exits their area.
   * @param event - The in-progress drag event.
   */
  protected _onDragHighlight(event: DragEvent): void;

  /**
   * Handle drag events over the directory.
   *
   * @remarks Does nothing. Declared so a subclass has the hook to override.
   */
  protected _onDragOver(event: DragEvent): void;

  protected _onDragStart(event: DragEvent): void;

  /**
   * Handle dragging a Document search result.
   *
   * @remarks Stops propagation so the directory's own drag handler does not also fire.
   */
  protected _onDragDocumentStart(event: DragEvent): void;

  protected _onDrop(event: DragEvent): Promise<void> | void;

  /**
   * Handle sorting a compendium pack relative to others in the directory.
   * @param pack     - The compendium pack.
   * @param sortData - Sort data.
   *
   * @remarks Persists ordering in the `core.compendiumConfiguration` setting.
   */
  protected _sortRelative(pack: CompendiumCollection.Any, sortData: CompendiumDirectory.SortRelativeData): void;

  #CompendiumDirectory: true;

  static #CompendiumDirectoryStatic: true;
}

declare namespace CompendiumDirectory {
  interface Any extends AnyCompendiumDirectory {}
  interface AnyConstructor extends Identity<typeof AnyCompendiumDirectory> {}

  interface PackContext {
    /** Whether the pack is locked. */
    locked: boolean;

    /** The pack's collection ID. */
    collection: string;

    /** The pack title. */
    title: string;

    /** The pack's banner image. */
    banner: string | null | undefined;

    /** Whether the pack has custom ownership configured. */
    customOwnership: boolean;

    /** The name of the package the pack belongs to. */
    package: string;

    /**
     * An icon representing the pack's contents.
     *
     * @remarks Absent when the pack's document type has no `sidebarIcon` configured.
     */
    icon: string | undefined;

    /**
     * Whether the pack is currently hidden.
     *
     * @remarks `0` while no filter is active.
     */
    hidden: boolean | 0;

    /**
     * An icon representing the pack's source (World, System, or Module).
     *
     * @remarks Absent for an unrecognized package type.
     */
    sourceIcon: string | undefined;

    /** CSS class names. */
    css: string;
  }

  interface SearchModeContext {
    icon: string;

    label: string;

    placeholder: string;
  }

  interface SortModeContext {
    icon: string;

    label: string;
  }

  interface EntryDragData {
    collection: string;

    type: "Compendium";
  }

  /** @privateRemarks Sort data for a dropped pack. */
  interface SortRelativeData {
    sortKey: string;

    /** The pack to sort against, or `null` to sort to the end of the target folder. */
    target: CompendiumCollection.Any | null;

    siblings: CompendiumCollection.Any[];

    updateData: SortRelativeUpdateData;
  }

  interface SortRelativeUpdateData {
    folder: string | null;
  }

  interface RenderContext
    extends
      HandlebarsApplicationMixin.RenderContext,
      AbstractSidebarTab.RenderContext,
      IntentionalPartial<PreparePartContext> {
    folderIcon: string;

    label: string;

    labelPlural: string;

    /**
     * @remarks Always the synthetic value `"Compendium"`.
     */
    documentName: string;

    sidebarIcon: string;
  }

  /** Members added by {@linkcode CompendiumDirectory._preparePartContext | #_preparePartContext}. */
  interface PreparePartContext {
    /** @remarks Added for the directory part. */
    canCreateEntry: boolean;

    /** @remarks Added for the directory part. */
    canCreateFolder: boolean;

    /** @remarks Added for the directory part. */
    entryPartial: string;

    /** @remarks Added for the directory part. */
    folderPartial: string;

    /** @remarks Added for the directory part. */
    packContext: Record<string, PackContext>;

    /** @remarks Added for the directory part. */
    maxFolderDepth: number;

    /** @remarks Added for the directory part. */
    tree: CompendiumPacks["tree"];

    /** @remarks Added for the header part. */
    filtersActive: number;

    /** @remarks Added for the header part. */
    searchMode: SearchModeContext;

    /** @remarks Added for the header part. */
    sortMode: SortModeContext;
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
