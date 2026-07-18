import type { AnyObject, DeepPartial, FixedInstanceType, Identity } from "#utils";
import type { Collection } from "#common/utils/_module.d.mts";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type AbstractSidebarTab from "./sidebar-tab.d.mts";
import type ContextMenu from "../ux/context-menu.d.mts";

import Document = foundry.abstract.Document;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      DocumentDirectory: DocumentDirectory.Any;
    }
  }
}

/**
 * An abstract class for rendering a foldered directory of Documents.
 */
declare class DocumentDirectory<
  DocumentClass extends Document.AnyConstructor = Document.AnyConstructor,
  RenderContext extends DocumentDirectory.RenderContext = DocumentDirectory.RenderContext,
  Configuration extends DocumentDirectory.Configuration = DocumentDirectory.Configuration,
  RenderOptions extends DocumentDirectory.RenderOptions = DocumentDirectory.RenderOptions,
> extends HandlebarsApplicationMixin(AbstractSidebarTab)<RenderContext, Configuration, RenderOptions> {
  // Fake override.

  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["directory", "flexcol"],
   *   collection: null,
   *   renderUpdateKeys: ["name", "img", "ownership", "sort", "folder"],
   *   actions: {
   *     activateEntry: DocumentDirectory.#onClickEntry,
   *     collapseFolders: DocumentDirectory.#onCollapseFolders,
   *     createEntry: DocumentDirectory.#onCreateEntry,
   *     createFolder: DocumentDirectory.#onCreateFolder,
   *     showIssues: DocumentDirectory.#onShowIssues,
   *     toggleFolder: DocumentDirectory.#onToggleFolder,
   *     toggleSearch: DocumentDirectory.#onToggleSearch,
   *     toggleSort: DocumentDirectory.#onToggleSort
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentDirectory.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   header: {
   *     template: "templates/sidebar/directory/header.hbs"
   *   },
   *   directory: {
   *     template: "templates/sidebar/directory/directory.hbs",
   *     scrollable: [""]
   *   },
   *   footer: {
   *     template: "templates/sidebar/directory/footer.hbs"
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * The path to the template used to render a single entry within the directory.
   * @defaultValue `"templates/sidebar/partials/document-partial.hbs"`
   */
  protected static _entryPartial: string;

  /**
   * The path to the template used to render a single folder within the directory.
   * @defaultValue `"templates/sidebar/partials/folder-partial.hbs"`
   */
  protected static _folderPartial: string;

  /**
   * The Document collection that this directory represents.
   * @remarks A document-name string passed as `collection` at construction is resolved to the
   * matching {@linkcode foundry.Game.collections | game.collections} entry in
   * {@linkcode DocumentDirectory._initializeApplicationOptions | #_initializeApplicationOptions}.
   */
  get collection(): Configuration["collection"];

  /**
   * The implementation of the Document type that this directory represents.
   */
  get documentClass(): DocumentClass;

  /**
   * The named Document type that this directory represents.
   */
  get documentName(): string;

  override get title(): string;

  protected override _initializeApplicationOptions(options: DeepPartial<Configuration>): Configuration;

  /**
   * Determine if the current user has permission to create directory entries.
   */
  protected _canCreateEntry(): boolean;

  /**
   * Determine if the current user has permission to create folders in this directory.
   */
  protected _canCreateFolder(): boolean;

  protected override _canRender(options: DeepPartial<RenderOptions>): false | void;

  protected override _configureRenderParts(
    options: RenderOptions,
  ): Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Register context menu entries and fire hooks.
   */
  protected _createContextMenus(): void;

  /**
   * Get context menu entries for entries in this directory.
   */
  protected _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];

  /**
   * Prepares the data for a duplicated Document.
   * @param document - The Document that is duplicated
   * @returns The partial data of the duplicate that overrides the original data
   */
  protected _prepareDuplicateData(document: FixedInstanceType<DocumentClass>): AnyObject;

  /**
   * Get context menu entries for folders in this directory.
   */
  protected _getFolderContextOptions(): ContextMenu.Entry<HTMLElement>[];

  protected override _onFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

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
   * Prepare render context for the footer part.
   * @param context - Shared context provided by _prepareContext
   * @param options - Options which configure application rendering behavior
   */
  protected _prepareFooterContext(
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
   * Handle activating a directory entry.
   * @param event   - The triggering click event.
   * @param target  - The action target element.
   * @param options - (default: `{}`)
   * @remarks The base implementation always resolves `void`; the union exists to accommodate subclass overrides
   * (e.g. {@linkcode foundry.applications.sidebar.apps.Compendium._onClickEntry | Compendium#_onClickEntry})
   * which return the rendered sheet.
   */
  protected _onClickEntry(
    event: PointerEvent,
    target: HTMLElement,
    options?: DocumentDirectory.HandlerOptions,
  ): Promise<ApplicationV2.Any | foundry.appv1.api.Application.Any | void>;

  /**
   * Handle creating a new entry in this directory.
   * @param event  - The triggering click event.
   * @param target - The action target element.
   * @remarks Returns whatever {@linkcode DocumentClass.createDialog | DocumentClass.createDialog} resolves to,
   * which is `Promise<unknown>` for a generic `DocumentClass`.
   */
  protected _onCreateEntry(event: PointerEvent, target: HTMLElement): Promise<unknown>;

  /**
   * Handle creating a new folder in this directory.
   * @param event  - The triggering click event.
   * @param target - The action target element.
   */
  protected _onCreateFolder(event: PointerEvent, target: HTMLElement): void;

  /**
   * Handle toggling a folder's expanded state.
   * @param event   - The triggering click event.
   * @param target  - The action target element.
   * @param options - (default: `{}`)
   */
  protected _onToggleFolder(event: PointerEvent, target: HTMLElement, options?: DocumentDirectory.HandlerOptions): void;

  /**
   * Handle matching a given directory entry with the search filter.
   * @param query    - The input search string.
   * @param entryIds - The matched directory entry IDs.
   * @param element  - The candidate entry element.
   * @param options  - Additional options for subclass-specific behavior.
   */
  protected _onMatchSearchEntry(query: string, entryIds: Set<string>, element: HTMLElement, options?: AnyObject): void;

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
   * @param entryIds      - The set of matched entry IDs.
   * @param folderIds     - The set of matched folder IDs.
   * @param autoExpandIds - The set of folder IDs that should be auto-expanded.
   * @param options       - Additional options for subclass-specific behavior.
   */
  protected _matchSearchEntries(
    query: RegExp,
    entryIds: Set<string>,
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
   */
  protected _matchSearchFolders(
    query: RegExp,
    folderIds: Set<string>,
    autoExpandIds: Set<string>,
    options?: AnyObject,
  ): void;

  /**
   * Determine if drop operations are permitted.
   * @param selector - The candidate HTML selector for dragging
   * @returns Can the current user drag this selector?
   */
  protected _canDragDrop(selector: string): boolean;

  /**
   * Determine if drag operations are permitted.
   * @param selector - The candidate HTML selector for dragging
   * @returns Can the current user drag this selector?
   */
  protected _canDragStart(selector: string): boolean;

  /**
   * Create a new entry in this directory from one that was dropped on it.
   * @param entry   - The dropped entry.
   * @param updates - Modifications to the creation data. (default: `{}`)
   * @remarks Resolves `undefined` when the "replace existing" dialog is declined
   */
  protected _createDroppedEntry(
    entry: FixedInstanceType<DocumentClass>,
    updates?: AnyObject,
  ): Promise<FixedInstanceType<DocumentClass> | undefined>;

  /**
   * Import a dropped folder and its children into this collection if they do not already exist.
   * @param folder       - The folder being dropped.
   * @param targetFolder - A folder to import into if not the directory root.
   */
  protected _createDroppedFolderContent(
    folder: Folder.Implementation,
    targetFolder?: Folder.Stored,
  ): Promise<Folder.Stored[]>;

  /**
   * Create a set of documents in a dropped folder.
   * @param folder    - The dropped folder.
   * @param documents - The documents to create, or their indices.
   */
  protected _createDroppedFolderDocuments(
    folder: Folder.Implementation,
    documents: FixedInstanceType<DocumentClass>[] | AnyObject[],
  ): Promise<void>;

  /**
   * Test if the given entry is already present in this directory.
   * @param entry - The directory entry.
   */
  protected _entryAlreadyExists(entry: Document.Any): boolean;

  /**
   * Determine whether a given directory entry belongs to the given folder.
   * @param entry  - The entry.
   * @param folder - The target folder ID.
   * @remarks Despite the Foundry JSDoc typing `folder` as `string`, callers may pass `null` or
   * `undefined` when testing for root-level entries.
   */
  protected _entryBelongsToFolder(entry: FixedInstanceType<DocumentClass>, folder: string | null | undefined): boolean;

  /**
   * Get the entry instance from its dropped data.
   * @param data - The drag data.
   * @throws If the correct instance type could not be retrieved.
   */
  protected _getDroppedEntryFromData(data: AnyObject): Promise<FixedInstanceType<DocumentClass> | undefined>;

  /**
   * Get drag data for an entry in this directory.
   * @param entryId - The entry's ID.
   */
  protected _getEntryDragData(entryId: string): Document.DropDataFor<FixedInstanceType<DocumentClass>["documentName"]>;

  /**
   * Get drag data for a folder in this directory.
   * @param folderId - The folder ID.
   */
  protected _getFolderDragData(folderId: string): Folder.DropData;

  /**
   * Handle dropping a new entry into this directory.
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
   * Handle importing a new folder's into the directory.
   * @param folder          - The dropped folder.
   * @param closestFolderId - The ID of the closest folder to the drop target.
   * @param sortData        - Sort data for the folder.
   */
  protected _handleDroppedForeignFolder(
    folder: Folder.Implementation,
    closestFolderId: string | undefined,
    sortData: AnyObject,
  ): Promise<{ folder: Folder.Stored; sortNeeded: boolean } | null>;

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

  protected _onDrop(event: DragEvent): Promise<void> | undefined;

  /**
   * Organize a dropped folder and its children into a list of folders and documents to create.
   * @param folder       - The dropped folder.
   * @param targetFolder - A folder to import into if not the directory root.
   * @remarks Despite the Foundry JSDoc typing `foldersToCreate` as `Folder[]` and
   * `documentsToCreate` as possibly `TDocument[]`, at runtime both arrays contain plain objects
   * produced by `toObject()` (or clones of compendium index entries), not Document instances.
   */
  protected _organizeDroppedFoldersAndDocuments(
    folder: Folder.Implementation,
    targetFolder?: Folder.Stored,
  ): Promise<{ foldersToCreate: Folder.CreateData[]; documentsToCreate: AnyObject[] }>;

  /**
   * Get context menu entries for folders in a directory.
   * @internal
   */
  static _getFolderContextOptions(): ContextMenu.Entry<HTMLElement>[];

  /**
   * Helper method to handle dropping a folder onto the directory.
   * @param target - The drop target element.
   * @param data   - The drop data.
   * @internal
   */
  static _handleDroppedFolder(
    target: HTMLElement | null,
    data: AnyObject,
    config: DocumentDirectory.HandleDroppedFolderConfig,
  ): Promise<DocumentDirectory.HandleDroppedFolderReturn | void>;

  /**
   * @deprecated "`DocumentDirectory#_onClickEntryName` is deprecated. Please use
   * {@linkcode DocumentDirectory._onClickEntry | DocumentDirectory#_onClickEntry} instead." (since v13, until v15)
   */
  protected _onClickEntryName(event: PointerEvent): Promise<void>;

  /**
   * @deprecated "`DocumentDirectory#_toggleFolder` is deprecated. Please use
   * {@linkcode DocumentDirectory._onToggleFolder | DocumentDirectory#_onToggleFolder} instead." (since v13, until v15)
   */
  protected _toggleFolder(event: PointerEvent): void;

  #DocumentDirectory: true;
}

declare namespace DocumentDirectory {
  interface Any extends AnyDocumentDirectory {}
  interface AnyConstructor extends Identity<typeof AnyDocumentDirectory> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, AbstractSidebarTab.RenderContext {
    documentName: string;
    folderIcon: string;
    sidebarIcon: string;
    canCreateEntry: boolean;
    canCreateFolder: boolean;

    /** @remarks Added by {@linkcode DocumentDirectory._prepareDirectoryContext | #_prepareDirectoryContext} */
    documentCls?: string | undefined;

    /** @remarks Added by {@linkcode DocumentDirectory._prepareDirectoryContext | #_prepareDirectoryContext} */
    entryPartial?: string | undefined;

    /** @remarks Added by {@linkcode DocumentDirectory._prepareDirectoryContext | #_prepareDirectoryContext} */
    folderPartial?: string | undefined;

    /** @remarks Added by {@linkcode DocumentDirectory._prepareDirectoryContext | #_prepareDirectoryContext} */
    maxFolderDepth?: number | undefined;

    /**
     * @remarks Added by {@linkcode DocumentDirectory._prepareDirectoryContext | #_prepareDirectoryContext}. Typed
     * as `unknown` because subclasses are free to reshape the tree into a bespoke render-context shape (e.g.
     * `PlaylistDirectory` transforms every node into a `PlaylistDirectory.TreeContext`); narrow via the owning
     * subclass's `RenderContext.tree` for a precise type. The base (non-overriding) shape is
     * {@linkcode foundry.documents.abstract.DirectoryCollectionMixin.TreeNode | DirectoryCollectionMixin.TreeNode}.
     */
    tree?: unknown;

    /** @remarks Added by {@linkcode DocumentDirectory._prepareFooterContext | #_prepareFooterContext} */
    buttons?: ApplicationV2.FormFooterButton[] | undefined;

    /** @remarks Added by {@linkcode DocumentDirectory._prepareHeaderContext | #_prepareHeaderContext} */
    searchMode?: SearchModeContext | undefined;

    /** @remarks Added by {@linkcode DocumentDirectory._prepareHeaderContext | #_prepareHeaderContext} */
    sortMode?: SortModeContext | undefined;
  }

  interface SearchModeContext {
    icon: string;
    label: string;
    placeholder?: string | undefined;
  }

  interface SortModeContext {
    icon: string;
    label: string;
  }

  interface Configuration<DocumentDirectory extends DocumentDirectory.Any = DocumentDirectory.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<DocumentDirectory> {
    /** The Document collection that this directory represents. */
    collection: foundry.documents.abstract.DirectoryCollectionMixin.AnyMixed;

    /** Updating one of these properties of a displayed Document will trigger a re-render of the tab. */
    renderUpdateKeys: string[];
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<DocumentDirectory extends DocumentDirectory.Any = DocumentDirectory.Any> = DeepPartial<
    Configuration<DocumentDirectory>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {
    /**
     * The event that re-renders of this directory are in response to, e.g. `"updateActor"`.
     * @remarks Consumed by {@linkcode DocumentDirectory._canRender | #_canRender}, which skips
     * re-rendering `update{documentName}` events unless one of the
     * {@linkcode Configuration.renderUpdateKeys | renderUpdateKeys} properties changed.
     */
    renderContext?: string | undefined;

    /**
     * The data of the change that triggered the re-render.
     * @remarks Consumed by {@linkcode DocumentDirectory._canRender | #_canRender}.
     */
    renderData?: AnyObject[] | undefined;
  }

  interface PartState extends HandlebarsApplicationMixin.PartState {
    /**
     * The current search query, preserved across re-renders of the header part.
     * @remarks Stashed by {@linkcode DocumentDirectory._preSyncPartState | #_preSyncPartState}
     * and restored by {@linkcode DocumentDirectory._syncPartState | #_syncPartState}.
     */
    query?: string | undefined;
  }

  interface HandlerOptions {
    /** Internal use only. */
    _skipDeprecation?: boolean | undefined;
  }

  interface HandleDroppedFolderConfig {
    /** The sibling folders. */
    folders: Collection<Folder.Stored, Collection.Methods.Any>;

    /** The label for entries in the directory. */
    label: string;

    /** The maximum folder depth in this directory. */
    maxFolderDepth: number;

    /** The type of entries in the directory. */
    type: string;
  }

  interface HandleDroppedFolderReturn {
    closestFolderId?: string | undefined;
    folder: Folder.Implementation;
    sortData: AnyObject;
    foreign?: boolean | undefined;
  }
}

declare abstract class AnyDocumentDirectory extends DocumentDirectory<
  Document.AnyConstructor,
  DocumentDirectory.RenderContext,
  DocumentDirectory.Configuration,
  DocumentDirectory.RenderOptions
> {
  constructor(...args: never);
}

export default DocumentDirectory;
