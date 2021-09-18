import { ConfiguredDocumentClass, ConfiguredDocumentClassForName } from '../../../../types/helperTypes';
import { DropData } from '../../clientDocumentMixin';

declare global {
  /**
   * A shared pattern for the sidebar directory which Actors, Items, and Scenes all use
   * @typeParam Name    - The the type of document being handled by this {@link SidebarDirectory}.
   * @typeParam Options - The type of the options object
   */
  abstract class SidebarDirectory<
    Name extends foundry.CONST.EntityType | 'FogExploration',
    Options extends SidebarDirectory.Options = SidebarDirectory.Options
  > extends SidebarTab<Options> {
    constructor(options?: Partial<SidebarDirectory.Options>);

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
     * @override
     * @defaultValue
     * ```typescript
     * const cls = getDocumentClass(this.documentName);
     * const collection = cls.metadata.collection;
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   id: collection,
     *   template: `templates/sidebar/${collection}-directory.html`,
     *   title: `${game.i18n.localize(cls.metadata.label)} Directory`,
     *   renderUpdateKeys: ["name", "img", "thumb", "permission", "sort", "sorting", "folder"],
     *   height: "auto",
     *   scrollY: ["ol.directory-list"],
     *   dragDrop: [{ dragSelector: ".directory-item",  dropSelector: ".directory-list"}],
     *   filters: [{inputSelector: 'input[name="search"]', contentSelector: ".directory-list"}],
     *   contextMenuSelector: ".entity"
     * });
     * ```
     */
    static get defaultOptions(): SidebarDirectory.Options;

    /**
     * The WorldCollection instance which this Sidebar Directory displays.
     */
    static get collection(): WorldCollection<
      ConfiguredDocumentClassForName<foundry.CONST.EntityType | 'FogExploration'>,
      string
    >;

    /**
     * Initialize the content of the directory by categorizing folders and entities into a hierarchical tree structure.
     */
    initialize(): void;

    tree: SidebarDirectory.Tree<this['documents'][number]>;

    /**
     * Given an entity type and a list of entities, set up the folder tree for that entity
     * @param folders  - The Array of Folder objects to organize
     * @param entities - The Array of Entity objects to organize
     * @returns A tree structure containing the folders and entities
     */
    static setupFolders<T extends SidebarDirectory<any, any>>(
      this: ConstructorOf<T>,
      folders: T['folders'],
      entities: T['documents']
    ): SidebarDirectory.Tree<T['documents'][number]>;

    /**
     * Populate a single folder with child folders and content
     * This method is called recursively when building the folder tree
     * @param allowChildren - (default: `true`)
     */
    protected static _populate<T extends SidebarDirectory<any, any>>(
      this: ConstructorOf<T>,
      folder: T['folders'][number],
      folders: T['folders'],
      entities: T['documents'],
      {
        allowChildren
      }?: {
        allowChildren: boolean;
      }
    ): [T['folders'], T['documents']];

    /**
     * @override
     */
    render(force?: boolean, context?: SidebarDirectory.RenderContext<Options>): this | void;

    /**
     * @param options - (unused)
     * @override
     * @remarks
     * This implementation doesn't actually return `PlaylistDirectory.Data`, it's only to allow {@link PlaylistDirectory}
     * to override accordingly.
     */
    getData(options?: Partial<Options>): SidebarDirectory.Data<this['tree']> | PlaylistDirectory.Data;

    /**
     * @param event - (unused)
     * @override
     */
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
     * Handle clicking on an Entity name in the Sidebar directory
     * @param event - The originating click event
     */
    protected _onClickEntityName(event: JQuery.ClickEvent): void | Promise<void>;

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

    /**
     * @override
     */
    protected _onDragStart(event: DragEvent): void;

    protected _dragType: string;

    /** @override */
    protected _canDragStart(selector: string): boolean;

    /**
     * Highlight folders as drop targets when a drag event enters or exits their area
     * @param event - The DragEvent which is in progress
     */
    protected _onDragHighlight(event: JQuery.DragEnterEvent | JQuery.DragLeaveEvent): void;

    /**
     * @override
     * @remarks
     * The return type could be specified in more detail but it is not supposed to be used and this allows more
     * flexibility for deriving classes.
     */
    protected _onDrop(event: DragEvent): unknown;

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

    /**
     * Default folder context actions
     * @param html - The context menu HTML being rendered for the directory
     */
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

    /**
     * @deprecated since 0.8.0
     */
    get entities(): this['documents'];
  }

  namespace SidebarDirectory {
    interface Data<ConcreteTree extends Tree<foundry.abstract.Document<any, any>>> {
      user: InstanceType<ConfiguredDocumentClass<typeof User>>;
      tree: ConcreteTree;
      canCreate: boolean;
      sidebarIcon: string;
    }

    interface Options extends Application.Options {
      renderUpdateKeys: string[];
      contextMenuSelector: string;
    }

    type RenderContext<Options extends SidebarDirectory.Options = SidebarDirectory.Options> =
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
