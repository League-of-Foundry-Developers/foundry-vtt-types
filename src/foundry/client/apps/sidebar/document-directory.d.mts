import type Document from "../../../common/abstract/document.d.mts";

declare global {
  interface DocumentDirectoryOptions extends ApplicationOptions {
    /**
     * A list of data property keys that will trigger a rerender of the tab if
     * they are updated on a Document that this tab is responsible for.
     */
    renderUpdateKeys?: string[];

    /**
     * The CSS selector that activates the context menu for displayed Documents.
     */
    contextMenuSelector?: string;

    /**
     * The CSS selector for the clickable area of an entry in the tab.
     */
    entryClickSelector?: string;

    collection: DocumentCollection.Any;
  }

  class DocumentDirectory<
    FolderType extends foundry.CONST.FOLDER_DOCUMENT_TYPES,
    Options extends DocumentDirectoryOptions = DocumentDirectoryOptions,
  > extends DirectoryApplicationMixin(SidebarTab)<Options> {
    constructor(options: Options);

    /**
     * References to the set of Documents which are displayed in the Sidebar
     */
    documents: FolderType extends Document.Type ? Document.ConfiguredInstanceForName<FolderType>[] : undefined;

    /**
     * Reference the set of Folders which exist in this Sidebar
     */
    folders: (Folder.ConfiguredInstance & { type: FolderType })[] | null;

    /**
     * A reference to the named Document type that this Sidebar Directory instance displays
     * @defaultValue `"Document"`
     */
    static documentName: string;

    static override entryPartial: string;

    get entryType(): string;

    /**
     * @defaultValue
     * ```ts
     * return foundry.utils.mergeObject(super.defaultOptions, {
     *   template: "templates/sidebar/document-directory.html",
     *   renderUpdateKeys: ["name", "img", "thumb", "ownership", "sort", "sorting", "folder"]
     * });
     * ```
     */
    static override get defaultOptions(): DocumentDirectoryOptions;

    override get title(): string;

    override get id(): string;

    override get tabName(): string;

    static get collection(): WorldCollection<Document.AnyConstructor, string>;

    /**
     * The collection of Documents which are displayed in this Sidebar Directory
     */
    get collection(): Options["collection"];

    /**
     * Initialize the content of the directory by categorizing folders and documents into a hierarchical tree structure.
     */
    initialize(): void;

    protected override _render(force?: boolean, options?: Application.RenderOptions<Options>): Promise<void>;

    override get canCreateEntry(): boolean;

    override get canCreateFolder(): boolean;

    override getData(options?: Partial<Options>): Promise<object>;

    override activateListeners(html: JQuery<HTMLElement>): void;

    protected override _onClickEntryName(event: PointerEvent): Promise<void>;

    protected override _onCreateEntry(event: PointerEvent): Promise<void>;

    protected override _onDrop(event: DragEvent): void;

    protected override _handleDroppedEntry(target: HTMLElement, data: object): Promise<void>;

    protected override _getDroppedEntryFromData(data: object): Promise<DirectoryMixinEntry>;

    protected override _sortRelative(
      entry: DirectoryMixinEntry,
      sortData: { sortKey: string; sortBefore: boolean; updateData: object },
    ): Promise<object>;

    protected override _createDroppedEntry(entry: DirectoryMixinEntry, folderId?: string): Promise<DirectoryMixinEntry>;

    protected override _handleDroppedForeignFolder(
      folder: Folder.ConfiguredInstance,
      closestFolderId: string,
      sortData: { sortKey: string; sortBefore: boolean },
    ): Promise<{ folder: Folder.ConfiguredInstance; sortNeeded: boolean } | null>;

    /**
     * Create a dropped Folder and its children in this Collection, if they do not already exist
     * @param folder       - The Folder being dropped
     * @param targetFolder - The Folder to which the Folder should be added
     * @returns The created Folders
     */
    protected _createDroppedFolderContent(
      folder: Folder.ConfiguredInstance,
      targetFolder: Folder.ConfiguredInstance,
    ): Promise<Array<Folder.ConfiguredInstance>>;

    /**
     * Organize a dropped Folder and its children into a list of folders to create and documents to create
     * @param folder       - The Folder being dropped
     * @param targetFolder - The Folder to which the Folder should be added
     */
    protected _organizeDroppedFoldersAndDocuments(
      folder: Folder.ConfiguredInstance,
      targetFolder: Folder.ConfiguredInstance,
    ): Promise<{
      foldersToCreate: Array<Folder.ConfiguredInstance>;
      documentsToCreate: Array<foundry.abstract.Document.Any>;
    }>;

    /**
     * Create a list of documents in a dropped Folder
     * @param folder            - The Folder being dropped
     * @param documentsToCreate - The documents to create
     */
    protected _createDroppedFolderDocuments(
      folder: Folder.ConfiguredInstance,
      documentsToCreate: Array<foundry.abstract.Document.Any>,
    ): Promise<void>;

    protected override _getFolderContextOptions(): ContextMenuEntry[];

    /**
     * Get the set of ContextMenu options which should be used for Documents in a SidebarDirectory
     * @returns The Array of context options passed to the ContextMenu instance
     */
    protected _getEntryContextOptions(): ContextMenuEntry[];

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks `"DocumentDirectory#_onCreateDocument is deprecated. Please use DocumentDirectory#_onCreateEntry instead."`
     */
    protected _onCreateDocument(event: PointerEvent): Promise<void>;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks `"DocumentDirectory#_handleDroppedDocument is deprecated. Please use DocumentDirectory#_handleDroppedEntry instead."`
     */
    protected _handleDroppedDocument(target: HTMLElement, data: object): Promise<void>;
  }

  namespace DocumentDirectory {
    type Any = DocumentDirectory<any, any>;
  }
}
