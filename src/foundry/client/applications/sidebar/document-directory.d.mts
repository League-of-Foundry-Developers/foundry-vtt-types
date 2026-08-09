import type { AnyMutableObject, AnyObject, DeepPartial, FixedInstanceType, Identity, MaybePromise } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type ContextMenu from "../ux/context-menu.d.mts";
import type AbstractSidebarTab from "./sidebar-tab.d.mts";

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
  static override DEFAULT_OPTIONS: DocumentDirectory.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * The path to the template used to render a single entry within the directory.
   */
  protected static _entryPartial: string;

  /**
   * The path to the template used to render a single folder within the directory.
   */
  protected static _folderPartial: string;

  /**
   * The Document collection that this directory represents.
   */
  get collection(): foundry.documents.abstract.DirectoryCollectionMixin.AnyMixed;

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
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * Register context menu entries and fire hooks.
   *
   * @remarks Fires the `getFolderContextOptions` hook and a `get<DocumentName>ContextOptions` hook.
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
  protected _prepareDuplicateData(document: FixedInstanceType<DocumentClass>): AnyMutableObject;

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
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  /**
   * Prepare render context for the directory part.
   */
  protected _prepareDirectoryContext(
    context: ApplicationV2.RenderContext,
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Promise<void>;

  /**
   * Prepare render context for the footer part.
   */
  protected _prepareFooterContext(
    context: ApplicationV2.RenderContext,
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Promise<void>;

  /**
   * Prepare render context for the header part.
   */
  protected _prepareHeaderContext(
    context: ApplicationV2.RenderContext,
    options: HandlebarsApplicationMixin.RenderOptions,
  ): Promise<void>;

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
   * Collapse all open folders in this directory.
   */
  collapseAll(): void;

  /**
   * Handle activating a directory entry.
   * @param event   - The triggering click event.
   * @param target  - The action target element.
   */
  protected _onClickEntry(
    event: PointerEvent,
    target: HTMLElement,
    options?: DocumentDirectory.SkipDeprecationOptions,
  ): Promise<void>;

  /**
   * Handle creating a new entry in this directory.
   * @param event  - The triggering click event.
   * @param target - The action target element.
   */
  protected _onCreateEntry(event: PointerEvent, target: HTMLElement): Promise<FixedInstanceType<DocumentClass> | null>;

  /**
   * Handle creating a new folder in this directory.
   * @param event  - The triggering click event.
   * @param target - The action target element.
   */
  protected _onCreateFolder(event: PointerEvent, target: HTMLElement): void;

  /**
   * Handle toggling a folder's expanded state.
   * @param event  - The triggering click event.
   * @param target - The action target element.
   */
  protected _onToggleFolder(
    event: PointerEvent,
    target: HTMLElement,
    options?: DocumentDirectory.SkipDeprecationOptions,
  ): void;

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
   * @param updates - Modifications to the creation data.
   */
  protected _createDroppedEntry(
    entry: FixedInstanceType<DocumentClass>,
    updates?: AnyObject,
  ): Promise<FixedInstanceType<DocumentClass>>;

  /**
   * Import a dropped folder and its children into this collection if they do not already exist.
   * @param folder       - The folder being dropped.
   * @param targetFolder - A folder to import into if not the directory root.
   */
  protected _createDroppedFolderContent(
    folder: Folder.Implementation,
    targetFolder?: Folder.Implementation,
  ): Promise<Folder.Implementation[]>;

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
  protected _entryAlreadyExists(entry: FixedInstanceType<DocumentClass>): boolean;

  /**
   * Determine whether a given directory entry belongs to the given folder.
   * @param entry  - The entry.
   * @param folder - The target folder ID.
   */
  protected _entryBelongsToFolder(entry: DocumentDirectory.Entry<DocumentClass>, folder: string | null): boolean;

  /**
   * Get the entry instance from its dropped data.
   * @param data - The drag data.
   * @throws If the correct instance type could not be retrieved.
   */
  protected _getDroppedEntryFromData(data: AnyObject): Promise<FixedInstanceType<DocumentClass>>;

  /**
   * Get drag data for an entry in this directory.
   * @param entryId - The entry's ID.
   */
  protected _getEntryDragData(entryId: string): AnyObject;

  /**
   * Get drag data for a folder in this directory.
   * @param folderId - The folder ID.
   */
  protected _getFolderDragData(folderId: string): AnyObject;

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
    closestFolderId: string,
    sortData: AnyObject,
  ): Promise<DocumentDirectory.DroppedForeignFolder | null>;

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

  protected _onDrop(event: DragEvent): Promise<void> | void;

  /**
   * Organize a dropped folder and its children into a list of folders and documents to create.
   * @param folder       - The dropped folder.
   * @param targetFolder - A folder to import into if not the directory root.
   *
   * @privateRemarks Synchronous at runtime despite Foundry's `@returns {Promise<...>}`; widened to
   * {@linkcode MaybePromise} because {@linkcode DocumentDirectory._createDroppedFolderContent} awaits the
   * result, so an async override in a subclass is safe.
   */
  protected _organizeDroppedFoldersAndDocuments(
    folder: Folder.Implementation,
    targetFolder?: Folder.Implementation,
  ): MaybePromise<DocumentDirectory.OrganizedDroppedFolder<DocumentClass>>;

  /**
   * Get context menu entries for folders in a directory.
   * @internal
   */
  protected static _getFolderContextOptions(): ContextMenu.Entry<HTMLElement>[];

  /**
   * Helper method to handle dropping a folder onto the directory.
   * @param target - The drop target element.
   * @param data   - The drop data.
   * @internal
   */
  protected static _handleDroppedFolder(
    target: HTMLElement | null,
    data: AnyObject,
    config: DocumentDirectory.HandleDroppedFolderConfig,
  ): Promise<DocumentDirectory.HandleDroppedFolderResult | void>;

  /**
   * @deprecated since v13 until v15.
   * @remarks "`DocumentDirectory#_onClickEntryName` is deprecated. Please use `DocumentDirectory#_onClickEntry` instead."
   */
  protected _onClickEntryName(event: PointerEvent): Promise<void>;

  /**
   * @deprecated since v13 until v15.
   * @remarks "`DocumentDirectory#_toggleFolder` is deprecated. Please use `DocumentDirectory#_onToggleFolder` instead."
   */
  protected _toggleFolder(event: PointerEvent): void;

  #DocumentDirectory: true;
}

declare namespace DocumentDirectory {
  interface Any extends AnyDocumentDirectory {}
  interface AnyConstructor extends Identity<typeof AnyDocumentDirectory> {}

  /**
   * @remarks Foundry's JSDoc names a `DirectoryMixinEntry` typedef that the V14 source never defines. The
   * directory reads only `_id` and `folder` off these, and for a compendium the values are index records
   * rather than documents.
   */
  type Entry<DocumentClass extends Document.AnyConstructor> = FixedInstanceType<DocumentClass> | IndexEntry;

  interface IndexEntry {
    _id: string;

    name: string;

    folder?: string | Folder.Implementation | null | undefined;
  }

  /** @remarks Foundry documents this parameter as "Internal use only." */
  interface SkipDeprecationOptions {
    /** @defaultValue `false` */
    _skipDeprecation?: boolean | undefined;
  }

  interface DroppedForeignFolder {
    folder: Folder.Implementation;

    sortNeeded: boolean;
  }

  interface OrganizedDroppedFolder<DocumentClass extends Document.AnyConstructor> {
    foldersToCreate: Folder.Implementation[];

    documentsToCreate: FixedInstanceType<DocumentClass>[] | AnyObject[];
  }

  interface HandleDroppedFolderConfig {
    /** The sibling folders. */
    folders: Folder.Implementation[];

    /** The label for entries in the directory. */
    label: string;

    /** The maximum folder depth in this directory. */
    maxFolderDepth: number;

    /** The type of entries in the directory. */
    type: string;
  }

  interface HandleDroppedFolderResult {
    closestFolderId?: string | undefined;

    folder: Folder.Implementation;

    sortData: AnyMutableObject;

    foreign?: boolean | undefined;
  }

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, AbstractSidebarTab.RenderContext {
    documentName: string;

    folderIcon: string;

    sidebarIcon: string;

    canCreateEntry: boolean;

    canCreateFolder: boolean;
  }

  interface Configuration<DocumentDirectory extends DocumentDirectory.Any = DocumentDirectory.Any>
    extends HandlebarsApplicationMixin.Configuration, ApplicationV2.Configuration<DocumentDirectory> {
    /**
     * The Document collection that this directory represents.
     *
     * @remarks A collection name is accepted here and resolved to the collection itself during
     * `_initializeApplicationOptions`.
     */
    collection: foundry.documents.abstract.DirectoryCollectionMixin.AnyMixed | string;

    /** Updating one of these properties of a displayed Document will trigger a re-render of the tab. */
    renderUpdateKeys: string[];
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<DocumentDirectory extends DocumentDirectory.Any = DocumentDirectory.Any> = DeepPartial<
    Configuration<DocumentDirectory>
  > &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, AbstractSidebarTab.RenderOptions {}
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
