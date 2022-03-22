import { ConfiguredDocumentClass, ConfiguredDocumentClassForName } from '../../../../types/helperTypes';
import type Document from '../../../common/abstract/document.mjs';
import { DropData } from '../../clientDocumentMixin';

declare global {
  interface SidebarDirectoryOptions extends ApplicationOptions {
    /**
     * A list of data property keys that will trigger a re-render of the tab if
     * they are updated on a Document that this tab is responsible for.
     */
    renderUpdateKeys: string[];

    /** The CSS selector that activates the context menu for displayed Documents. */
    contextMenuSelector: string;
  }

  /**
   * A shared pattern for the sidebar directory which Actors, Items, and Scenes all use
   * @typeParam Name    - The the type of document being handled by this {@link SidebarDirectory}.
   * @typeParam Options - The type of the options object
   */
  abstract class SidebarDirectory<
    Name extends foundry.CONST.DOCUMENT_TYPES,
    Options extends SidebarDirectoryOptions = SidebarDirectoryOptions
  > extends SidebarTab<Options> {
    constructor(options?: Partial<SidebarDirectoryOptions>);

    /**
     * References to the set of Documents which are displayed in the Sidebar
     */
    documents: InstanceType<ConfiguredDocumentClassForName<Name>>[];

    /**
     * Reference the set of Folders which exist in this Sidebar
     */
    folders: InstanceType<ConfiguredDocumentClass<typeof Folder>>[];

    /**
     * A reference to the named Document type that this Sidebar Directory instance displays
     * @defaultValue `'Document'`
     */
    static documentName: string;

    /**
     * The path to the template partial which renders a single Document within this directory
     * @defaultValue `'templates/sidebar/document-partial.html'`
     */
    static documentPartial: string;

    /**
     * The path to the template partial which renders a single Folder within this directory
     * @defaultValue `'templates/sidebar/folder-partial.html'`
     */
    static folderPartial: string;

    /**
     * @override
     * @defaultValue
     * ```typescript
     * const cls = getDocumentClass(this.documentName);
     * const collection = cls.metadata.collection;
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: collection,
     *   template: "templates/sidebar/document-directory.html",
     *   title: `${game.i18n.localize(cls.metadata.labelPlural)} Directory`,
     *   renderUpdateKeys: ["name", "img", "thumb", "permission", "sort", "sorting", "folder"],
     *   height: "auto",
     *   scrollY: ["ol.directory-list"],
     *   dragDrop: [{ dragSelector: ".directory-item",  dropSelector: ".directory-list"}],
     *   filters: [{inputSelector: 'input[name="search"]', contentSelector: ".directory-list"}],
     *   contextMenuSelector: ".document"
     * });
     * ```
     */
    static get defaultOptions(): SidebarDirectoryOptions;

    /**
     * The WorldCollection instance which this Sidebar Directory displays.
     */
    static get collection(): WorldCollection<
      ConfiguredDocumentClassForName<foundry.CONST.DOCUMENT_TYPES | 'FogExploration'>,
      string
    >;

    /**
     * Initialize the content of the directory by categorizing folders and documents into a hierarchical tree structure.
     */
    initialize(): void;

    tree: SidebarDirectory.Tree<this['documents'][number]>;

    /**
     * Given an entity type and a list of entities, set up the folder tree for that entity
     * @param folders  - The Array of Folder objects to organize
     * @param documents - The Array of Entity objects to organize
     * @returns A tree structure containing the folders and entities
     */
    static setupFolders<T extends SidebarDirectory<any, any>>(
      this: ConstructorOf<T>,
      folders: T['folders'],
      documents: T['documents']
    ): SidebarDirectory.Tree<T['documents'][number]>;

    /**
     * Populate a single folder with child folders and content
     * This method is called recursively when building the folder tree
     * @internal
     */
    protected static _populate<T extends SidebarDirectory<any, any>>(
      this: ConstructorOf<T>,
      folder: T['folders'][number],
      folders: T['folders'],
      documents: T['documents'],
      {
        allowChildren
      }?: {
        allowChildren: boolean;
      }
    ): [T['folders'], T['documents']];

    /**
     * Sort two Documents by name, alphabetically.
     * @returns A value &lt; 0 if b should be sorted before a.
     *          A value &gt; 0 if a should be sorted before b.
     *          0 if the position of a and b should not change.
     * @internal
     */
    protected static _sortAlphabetical(a: Document<any, any>, b: Document<any, any>): number;

    /** @override */
    protected _render(force?: boolean, options?: Application.RenderOptions<Options>): Promise<void>;

    /** @override */
    getData(options?: Partial<Options>): Promise<SidebarDirectory.Data<this['tree']>>;

    /** @override */
    protected _renderInner(data: SidebarDirectory.Data<this['tree']>): Promise<JQuery>;

    /** @override */
    protected _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;

    /**
     * Collapse all subfolders in this directory
     */
    collapseAll(): void;

    /**
     * Activate event listeners triggered within the Actor Directory HTML
     */
    activateListeners(html: JQuery): void;

    /**
     * Handle clicking on an Document name in the Sidebar directory
     * @param event - The originating click event
     */
    protected _onClickDocumentame(event: JQuery.ClickEvent): void | Promise<void>;

    /**
     * Handle new creation request
     * @param event - The originating button click event
     */
    protected _onCreateDocument(
      event: JQuery.ClickEvent
    ): Promise<InstanceType<ConfiguredDocumentClassForName<Name>> | undefined>;

    /**
     * Create a new Folder in this SidebarDirectory
     * @param event - The originating button click event
     */
    protected _onCreateFolder(event: JQuery.ClickEvent): void;

    /**
     * Handle toggling the collapsed or expanded state of a folder within the directory tab
     * @param event - The originating click event
     */
    protected _toggleFolder(event: JQuery.ClickEvent): void;

    /** @override */
    protected _onDragStart(event: DragEvent): void;

    /** @remarks Seems to be unused, see https://gitlab.com/foundrynet/foundryvtt/-/issues/6882 */
    protected _dragType?: string;

    /** @override */
    protected _canDragStart(selector: string): boolean;

    /**
     * Highlight folders as drop targets when a drag event enters or exits their area
     * @param event - The DragEvent which is in progress
     */
    protected _onDragHighlight(event: JQuery.DragEnterEvent | JQuery.DragLeaveEvent): void;

    /** @override */
    protected _onDrop(event: DragEvent): void;

    /**
     * Handle Document data being dropped into the directory.
     * @param target - The target element
     * @param data   - The data being dropped
     */
    protected _handleDroppedDocument(
      target: HTMLElement,
      data: DropData<InstanceType<ConfiguredDocumentClassForName<Name>>>
    ): Promise<InstanceType<ConfiguredDocumentClassForName<Name>> | undefined>;

    /**
     * Handle Folder data being dropped into the directory.
     * @param target - The target element
     * @param data   - The data being dropped
     */
    protected _handleDroppedFolder(
      target: HTMLElement,
      data: DropData<InstanceType<ConfiguredDocumentClass<typeof Folder>>>
    ): Promise<InstanceType<ConfiguredDocumentClass<typeof Folder>> | undefined>;

    /** @override */
    protected _contextMenu(html: JQuery): void;

    /**
     * Get the set of ContextMenu options which should be used for Folders in a SidebarDirectory
     * @returns The Array of context options passed to the ContextMenu instance
     */
    protected _getFolderContextOptions(): ContextMenuEntry[];

    /**
     * Get the set of ContextMenu options which should be used for Entities in a SidebarDirectory
     * @returns The Array of context options passed to the ContextMenu instance
     */
    protected _getEntryContextOptions(): ContextMenuEntry[];
  }

  namespace SidebarDirectory {
    interface Data<ConcreteTree extends Tree<foundry.abstract.Document<any, any>>> {
      user: InstanceType<ConfiguredDocumentClass<typeof User>>;
      tree: ConcreteTree;
      canCreate: boolean;
      documentCls: string;
      tabName: string;
      sidebarIcon: string;
      folderIcon: string;
      label: string;
      labelPlural: string;
      documentPartial: string;
      folderPartial: string;
    }

    type RenderContext<Options extends SidebarDirectoryOptions = SidebarDirectoryOptions> =
      Application.RenderOptions<Options> & {
        action?: string;
        data?: string;
        entityType?: string;
      };

    interface Tree<ConcreteDocument extends foundry.abstract.Document<any, any>> {
      root?: boolean;
      content: ConcreteDocument[];
      children: (Folder & Tree<ConcreteDocument>)[];
    }
  }
}
