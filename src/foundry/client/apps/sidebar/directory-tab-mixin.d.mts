import type { FixedInstanceType, Mixin } from "fvtt-types/utils";

declare class DirectoryApplication {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * The path to the template partial which renders a single Entry within this directory
   */
  static entryPartial: string;

  /**
   * The path to the template partial which renders a single Folder within this directory
   */
  static folderPartial: string;

  static get defaultOptions(): DocumentDirectoryOptions;

  /**
   * The type of Entry that is contained in this DirectoryTab.
   */
  get entryType(): string;

  /**
   * The maximum depth of folder nesting which is allowed in this DirectoryTab
   */
  get maxFolderDepth(): number;

  /**
   * Can the current User create new Entries in this DirectoryTab?
   */
  get canCreateEntry(): boolean;

  /**
   * Can the current User create new Folders in this DirectoryTab?
   */
  get canCreateFolder(): boolean;

  protected _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;

  /**
   * Identify folders in the collection which match a provided search query.
   * This method is factored out to be extended by subclasses, for example to support compendium indices.
   * @param query         - The search query
   * @param includeFolder - A callback function to include the folder of any matched entry
   */
  protected _matchSearchFolders(
    query: RegExp,
    includeFolder: (folder: Folder.ConfiguredInstance, autoExpand?: boolean) => boolean,
  ): void;

  /**
   * Identify entries in the collection which match a provided search query.
   * This method is factored out to be extended by subclasses, for example to support compendium indices.
   * @param query         - The search query
   * @param entryIds      - The set of matched Entry IDs
   * @param folderIds     - The set of matched Folder IDs
   * @param includeFolder - A callback function to include the folder of any matched entry
   */
  protected _matchSearchEntries(
    query: RegExp,
    entryIds: Set<string>,
    folderIds: Set<string>,
    includeFolder: (folder: Folder.ConfiguredInstance, autoExpand?: boolean) => boolean,
  ): void;

  /**
   * Get the name to search against for a given entry
   * @param entry - The entry to get the name for
   * @returns The name of the entry
   */
  protected _getEntryName(entry: object): string;

  /**
   * Get the ID for a given entry
   * @param entry - The entry to get the id for
   * @returns The id of the entry
   */
  protected _getEntryId(entry: object): string;

  getData(options?: Partial<ApplicationOptions>): Promise<object>; // TODO: Implement GetDataReturnType

  protected _render(force?: boolean, options?: Application.RenderOptions<ApplicationOptions>): Promise<void>;

  activateListeners(html: JQuery): void;

  /**
   * Collapse all subfolders in this directory
   */
  collapseAll(): void;

  /**
   * Create a new Folder in this SidebarDirectory
   * @param event - The originating button click event
   */
  protected _onCreateFolder(event: PointerEvent): void;

  /**
   * Handle toggling the collapsed or expanded state of a folder within the directory tab
   * @param event - The originating click event
   */
  protected _toggleFolder(event: PointerEvent): void;

  /**
   * Handle clicking on a Document name in the Sidebar directory
   * @param event - The originating click event
   */
  protected _onClickEntryName(event: PointerEvent): Promise<void>;

  /**
   * Handle new Entry creation request
   * @param event - The originating button click event
   */
  protected _onCreateEntry(event: PointerEvent): Promise<void>;

  protected _onDragStart(event: DragEvent): void;

  /**
   * Get the data transfer object for a Entry being dragged from this SidebarDirectory
   * @param entryId - The Entry's _id being dragged
   */
  protected _getEntryDragData(entryId: string): object; // TODO: DragData improvements

  /**
   * Get the data transfer object for a Folder being dragged from this SidebarDirectory
   * @param folderId - The Folder _id being dragged
   */
  protected _getFolderDragData(folderId: string): object;

  protected _canDragStart(selector: string): boolean;

  /**
   * Highlight folders as drop targets when a drag event enters or exits their area
   * @param event - The DragEvent which is in progress
   */
  protected _onDragHighlight(event: DragEvent): void;

  protected _onDrop(event: DragEvent): void;

  /**
   * Handle Folder data being dropped into the directory.
   * @param target - The target element
   * @param data   - The data being dropped // TODO: DragData improvements
   */
  protected _handleDroppedFolder(target: HTMLElement, data: object): Promise<void>;

  /**
   * Handle a new Folder being dropped into the directory.
   * This case is not handled by default, but subclasses may implement custom handling here.
   * @param folder          - The Folder being dropped
   * @param closestFolderId - The closest Folder _id to the drop target
   * @param sortData        - The sort data for the Folder
   */
  protected _handleDroppedForeignFolder(
    folder: Folder.ConfiguredInstance,
    closestFolderId: string,
    sortData: {
      /**
       * The sort key to use for sorting
       */
      sortKey: string;
      /**
       * Sort before the target?
       */
      sortBefore: boolean;
    },
  ): Promise<{ folder: Folder.ConfiguredInstance; sortNeeded: boolean } | null>;

  /**
   * Handle Entry data being dropped into the directory.
   * @param target - The target element
   * @param data   - The data being dropped // TODO: DragData improvements
   */
  protected _handleDroppedEntry(target: HTMLElement, data: object): Promise<void>;

  /**
   * Determine if an Entry is being compared to itself
   * @param entry      - The Entry
   * @param otherEntry - The other Entry
   * @returns Is the Entry being compared to itself?
   */
  protected _entryIsSelf(entry: DirectoryMixinEntry, otherEntry: DirectoryMixinEntry): boolean;

  /**
   * Determine whether an Entry belongs to the target folder
   * @param entry  - The Entry
   * @param folder - The target Folder
   * @returns Is the Entry a sibling?
   */
  protected _entryBelongsToFolder(entry: DirectoryMixinEntry, folder: Folder.ConfiguredInstance): boolean;

  /**
   * Check if an Entry is already present in the Collection
   * @param entry - The entry being dropped
   * @returns Is the Entry already present?
   */
  protected _entryAlreadyExists(entry: DirectoryMixinEntry): boolean;

  /**
   * Get the dropped Entry from the drop data
   * @param data - The data being dropped
   * @returns The dropped Entry
   */
  protected _getDroppedEntryFromData(data: object): Promise<DirectoryMixinEntry>;

  /**
   * Create a dropped Entry in this Collection
   * @param entry    - The Entry being dropped
   * @param folderId - The ID of the Folder to which the Entry should be added
   * @returns THe created Entry
   */
  protected _createDroppedEntry(entry: DirectoryMixinEntry, folderId?: string): Promise<DirectoryMixinEntry>;

  /**
   * Sort a relative entry within a collection
   * @param entry    - The entry to sort
   * @param sortData - The sort data
   * @returns The sorted entry
   */
  protected _sortRelative(
    entry: DirectoryMixinEntry,
    sortData: {
      /**
       * The sort key to use for sorting
       */
      sortKey: string;
      /**
       * Sort before the target?
       */
      sortBefore: boolean;
      /**
       * Additional data to update on the entry
       */
      updateData: object;
    },
  ): Promise<object>;

  protected _contextMenu(html: JQuery): void;

  /**
   * Get the set of ContextMenu options which should be used for Folders in a SidebarDirectory
   * @returns The Array of context options passed to the ContextMenu instance
   */
  protected _getFolderContextOptions(): ContextMenuEntry[];

  /**
   * Get the set of ContextMenu options which should be used for Entries in a SidebarDirectory
   * @returns The array of context options passed to the ContextMenu instance
   */
  protected _getEntryContextOptions(): ContextMenuEntry[];
}

declare global {
  interface DirectoryMixinEntry {
    /**
     * The unique id of the entry
     */
    id: string;
    /**
     * The folder id or folder object to which this entry belongs
     */
    folder: Folder.ConfiguredInstance | string;
    /**
     * An image path to display for the entry
     */
    img?: string;
    /**
     * A numeric sort value which orders this entry relative to others
     */
    sort?: string;
  }

  function DirectoryApplicationMixin<BaseApplication extends DirectoryApplicationMixin.BaseClass>(
    Base: BaseApplication,
  ): Mixin<typeof DirectoryApplication, BaseApplication>;

  namespace DirectoryApplicationMixin {
    type AnyMixedConstructor = ReturnType<typeof DirectoryApplicationMixin<BaseClass>>;
    interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

    type BaseClass = Application.AnyConstructor;
  }
}
