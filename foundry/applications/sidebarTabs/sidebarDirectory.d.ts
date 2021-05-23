/**
 * A shared pattern for the sidebar directory which Actors, Items, and Scenes all use
 * @typeParam P - the type of the options object
 */
declare abstract class SidebarDirectory<
  P extends SidebarDirectory.Options = SidebarDirectory.Options
> extends SidebarTab<P> {
  /**
   * A reference to the Entity class which is displayed within this EntityCollection
   */
  static get cls(): ConstructorOf<Entity>;

  /**
   * The Entity collection which this Sidebar Directory contains
   * @remarks This method is abstract in SidebarTab.
   */
  static get collection(): EntityCollection | undefined;

  /**
   * @override
   */
  static get defaultOptions(): SidebarDirectory.Options;

  /**
   * The named entity which this Sidebar Directory contains
   * @remarks This method is abstract in SidebarTab.
   */
  static get entity(): string;

  /**
   * Given an entity type and a list of entities, set up the folder tree for that entity
   * @param folders  - The Array of Folder objects to organize
   * @param entities - The Array of Entity objects to organize
   * @returns A tree structure containing the folders and entities
   */
  static setupFolders(folders: Folder[], entities: Entity[]): SidebarDirectory.Tree;

  /**
   * Populate a single folder with child folders and content
   * This method is called recursively when building the folder tree
   * @param allowChildren - (default: `true`)
   */
  protected static _populate(
    folder: Folder,
    folders: Folder[],
    entities: Entity[],
    {
      allowChildren
    }: {
      allowChildren: boolean;
    }
  ): [Folder[], Entity[]];

  /**
   * References to the set of Entities which are displayed in the Sidebar
   */
  entities: Entity[];

  /**
   * Reference the set of Folders which exist in this Sidebar
   * @defaultValue `null`
   */
  folders: Folder[];

  tree: SidebarDirectory.Tree;

  protected _dragType: string;

  /**
   * Activate event listeners triggered within the Actor Directory HTML
   */
  activateListeners(html: JQuery): void;

  /**
   * Collapse all subfolders in this directory
   */
  collapseAll(): void;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: Application.RenderOptions): SidebarDirectory.Data | PlaylistDirectory.Data;

  /**
   * Initialize the content of the directory by categorizing folders and entities into a hierarchical tree structure.
   */
  initialize(): void;

  /**
   * @override
   */
  render(force?: boolean, context?: Partial<SidebarDirectory.RenderContext>): this | void;

  /**
   * Default folder context actions
   */
  protected _contextMenu(html: JQuery): void;

  /**
   * Get the set of ContextMenu options which should be used for Entities in a SidebarDirectory
   * @returns The Array of context options passed to the ContextMenu instance
   */
  protected _getEntryContextOptions(): ContextMenu.Item[];

  /**
   * Get the set of ContextMenu options which should be used for Folders in a SidebarDirectory
   * @returns The Array of context options passed to the ContextMenu instance
   */
  protected _getFolderContextOptions(): ContextMenu.Item[];

  /**
   * Define the behavior of the sidebar tab when it received a dropped data object
   * @param event - The original drop event
   * @param data  - The data being dropped
   */
  protected _handleDropData(event: DragEvent, data: unknown): unknown;

  /**
   * Handle clicking on an Entity name in the Sidebar directory
   * @param event - The originating click event
   */
  protected _onClickEntityName(event: JQuery.ClickEvent): void;

  /**
   * Handle new creation request
   * @param event - The originating button click event
   */
  protected _onCreateEntity(event: JQuery.ClickEvent): Promise<Entity>;

  /**
   * Create a new Folder in this SidebarDirectory
   * @param event - The originating button click event
   */
  protected _onCreateFolder(event: JQuery.ClickEvent): void;

  /**
   * Highlight folders as drop targets when a drag event enters or exits their area
   * @param event - The DragEvent which is in progress
   */
  protected _onDragHighlight(event: JQuery.DragEnterEvent | JQuery.DragLeaveEvent): void;

  /**
   * @override
   */
  protected _onDragStart(event: DragEvent): void;

  /**
   * @override
   */
  protected _onDrop(event: DragEvent): void;

  /**
   * @param event - (unused)
   * @override
   */
  protected _onSearchFilter(event: KeyboardEvent, query: string, html: HTMLElement): void;

  /**
   * Handle toggling the collapsed or expanded state of a folder within the directory tab
   * @param event - The originating click event
   */
  protected _toggleFolder(event: JQuery.ClickEvent): void;
}

declare namespace SidebarDirectory {
  interface Data {
    canCreate: boolean;
    sidebarIcon: string;
    tree: SidebarDirectory['tree'];
    user: User;
  }

  interface Options extends SidebarTab.Options {
    dragDrop: Array<
      DragDrop.Options & {
        /**
         * @defaultValue `'.directory-item'`
         */
        dragSelector: string;

        /**
         * @defaultValue `'.directory-list'`
         */
        dropSelector: string;
      }
    >;

    filters: Array<
      SearchFilter.Options & {
        /**
         * @defaultValue `'input[name="search"]'`
         */
        inputSelector: string;

        /**
         * @defaultValue `'.directory-list'`
         */
        contentSelector: string;
      }
    >;

    /**
     * @defaultValue `'auto'`
     */
    height: number | 'auto';

    /**
     * @defaultValue
     * ```typescript
     * `${this.entity.toLowerCase()}s`
     * ```
     */
    id: string;

    /**
     * @defaultValue `['name', 'img', 'thumb', 'permission', 'sort', 'folder']`
     */
    renderUpdateKeys: string[];

    /**
     * @defaultValue `['ol.directory-list']`
     */
    scrollY: string[];

    /**
     * @defaultValue
     * ```typescript
     * `templates/sidebar/${this.entity.toLowerCase()}-directory.html`
     * ```
     */
    template: string;

    /**
     * @defaultValue
     * ```typescript
     * `${this.entity}s Directory`
     * ```
     */
    title: string;
  }

  interface RenderContext extends Application.RenderOptions {
    action: string;
    data: string;
    entityType: string;
  }

  interface Tree {
    children: Folder[];
    content: Entity[];
    root: boolean;
  }
}
