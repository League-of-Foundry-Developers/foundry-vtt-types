/**
 * @defaultValue `0`
 */
declare let _appId: number;

/**
 * @defaultValue `100`
 */
declare let _maxZ: number;

declare const MIN_WINDOW_WIDTH: 200;
declare const MIN_WINDOW_HEIGHT: 50;

interface ApplicationOptions {
  /**
   * A named "base application" which generates an additional hook
   * @defaultValue `null`
   */
  baseApplication: string | null;

  /**
   * The default pixel width for the rendered HTML
   * @defaultValue `null`
   */
  width: number | null;

  /**
   * The default pixel height for the rendered HTML
   * @defaultValue `null`
   */
  height: number | "auto" | null;

  /**
   * The default offset-top position for the rendered HTML
   * @defaultValue `null`
   */
  top: number | null;

  /**
   * The default offset-left position for the rendered HTML
   * @defaultValue `null`
   */
  left: number | null;

  /**
   * A transformation scale for the rendered HTML
   * @defaultValue `null`
   */
  scale: number | null;

  /**
   * Whether to display the application as a pop-out container
   * @defaultValue `true`
   */
  popOut: boolean;

  /**
   * Whether the rendered application can be minimized (popOut only)
   * @defaultValue `true`
   */
  minimizable: boolean;

  /**
   * Whether the rendered application can be drag-resized (popOut only)
   * @defaultValue `false`
   */
  resizable: boolean;

  /**
   * The default CSS id to assign to the rendered HTML
   * @defaultValue `""`
   */
  id: string;

  /**
   * An array of CSS string classes to apply to the rendered HTML
   * @defaultValue `[]`
   */
  classes: string[];

  /**
   * A default window title string (popOut only)
   * @defaultValue `""`
   */
  title: string;

  /**
   * The default HTML template path to render for this Application
   * @defaultValue `null`
   */
  template: string | null;

  /**
   * A list of unique CSS selectors which target containers that should
   * have their vertical scroll positions preserved during a re-render.
   * @defaultValue `[]`
   */
  scrollY: string[];

  /**
   * An array of tabbed container configurations which should be enabled
   * for the application.
   * @defaultValue `[]`
   */
  tabs: Omit<TabsConfiguration, "callback">[];

  /**
   * @defaultValue `[]`
   */
  dragDrop: Omit<DragDropConfiguration, "permissions" | "callbacks">[];

  /**
   * @defaultValue `[]`
   */
  filters: Omit<SearchFilterConfiguration, "callback">[];
}

/**
 * The standard application window that is rendered for a large variety of UI elements in Foundry VTT.
 * @typeParam Options - the type of the options object
 */
declare abstract class Application<Options extends ApplicationOptions = ApplicationOptions> {
  /**
   * @param options - Configuration options which control how the application is rendered.
   *                  Application subclasses may add additional supported options, but the
   *                  following configurations are supported for all Applications. The values
   *                  passed to the constructor are combined with the defaultOptions defined
   *                  at the class level.
   */
  constructor(options?: Partial<Options>);

  /**
   * The options provided to this application upon initialization
   */
  options: Options;

  /**
   * The application ID is a unique incrementing integer which is used to identify every application window
   * drawn by the VTT
   */
  appId: number;

  /**
   * An internal reference to the HTML element this application renders
   * @defaultValue `null`
   */
  protected _element: JQuery | null;

  /**
   * Track the current position and dimensions of the Application UI
   */
  position: Application.Position;

  /**
   * DragDrop workflow handlers which are active for this Application
   */
  protected _dragDrop: DragDrop[];

  /**
   * Tab navigation handlers which are active for this Application
   */
  protected _tabs: Tabs[];

  /**
   * SearchFilter handlers which are active for this Application
   */
  protected _searchFilters: SearchFilter[];

  /**
   * Track whether the Application is currently minimized
   * @defaultValue `false`
   */
  protected _minimized: boolean;

  /**
   * Track the render state of the Application
   * @defaultValue {@link Application.RENDER_STATES.NONE}
   * @see {@link Application.RENDER_STATES}
   */
  protected _state: Application.RenderState;

  /**
   * The prior render state of this Application.
   * This allows for rendering logic to understand if the application is being rendered for the first time.
   * @defaultValue {@link Application.RENDER_STATES.NONE}
   * @see {@link Application.RENDER_STATES}
   */
  protected _priorState: Application.RenderState;

  /**
   * Track the most recent scroll positions for any vertically scrolling containers
   * @defaultValue `null`
   */
  protected _scrollPositions: Record<string, number> | null;

  /**
   * The sequence of rendering states that track the Application life-cycle.
   * @see {@link Application.RenderState}
   */
  static RENDER_STATES: Readonly<{
    CLOSING: -2;
    CLOSED: -1;
    NONE: 0;
    RENDERING: 1;
    RENDERED: 2;
    ERROR: 3;
  }>;

  /**
   * Create drag-and-drop workflow handlers for this Application
   * @returns An array of DragDrop handlers
   * @internal
   */
  protected _createDragDropHandlers(): DragDrop[];

  /**
   * Create tabbed navigation handlers for this Application
   * @returns An array of Tabs handlers
   * @internal
   */
  protected _createTabHandlers(): Tabs[];

  /**
   * Create search filter handlers for this Application
   * @returns An array of SearchFilter handlers
   * @internal
   */
  protected _createSearchFilters(): SearchFilter[];

  /**
   * Assign the default options configuration which is used by this Application class. The options and values defined
   * in this object are merged with any provided option values which are passed to the constructor upon initialization.
   * Application subclasses may include additional options which are specific to their usage.
   */
  static get defaultOptions(): ApplicationOptions;

  /**
   * Return the CSS application ID which uniquely references this UI element
   */
  get id(): string;

  /**
   * Return the active application element, if it currently exists in the DOM
   */
  get element(): JQuery;

  /**
   * The path to the HTML template file which should be used to render the inner content of the app
   */
  get template(): string;

  /**
   * Control the rendering style of the application. If popOut is true, the application is rendered in its own
   * wrapper window, otherwise only the inner app content is rendered
   */
  get popOut(): boolean;

  /**
   * Return a flag for whether the Application instance is currently rendered
   */
  get rendered(): boolean;

  /**
   * An Application window should define its own title definition logic which may be dynamic depending on its data
   */
  get title(): string;

  /**
   * An application should define the data object used to render its template.
   * This function may either return an Object directly, or a Promise which resolves to an Object
   * If undefined, the default implementation will return an empty object allowing only for rendering of static HTML
   * @param options - (unused, default: `{}`)
   */
  getData(options?: Partial<Options>): MaybePromise<object>;

  /**
   * Render the Application by evaluating it's HTML template against the object of data provided by the getData method
   * If the Application is rendered as a pop-out window, wrap the contained HTML in an outer frame with window controls
   *
   * @param force   - Add the rendered application to the DOM if it is not already present. If false, the
   *                  Application will only be re-rendered if it is already present.
   *                  (default: `false`)
   * @param options - Additional rendering options which are applied to customize the way that the Application
   *                  is rendered in the DOM.
   *                  (default: `{}`)
   * @returns The rendered Application instance
   * @remarks Some subclasses return other results.
   */
  render(force?: boolean, options?: Application.RenderOptions<Options>): unknown;

  /**
   * An asynchronous inner function which handles the rendering of the Application
   * @param force   - Render and display the application even if it is not currently displayed.
   *                  (default: `false`)
   * @param options - Additional options which update the current values of the Application#options object
   *                  (default: `{}`)
   * @returns A Promise that resolves to the Application once rendering is complete
   */
  protected _render(force?: boolean, options?: Application.RenderOptions<Options>): Promise<void>;

  /**
   * Return the inheritance chain for this Application class up to (and including) it's base Application class.
   * @internal
   */
  protected static _getInheritanceChain(): typeof Application[];

  /**
   * Persist the scroll positions of containers within the app before re-rendering the content
   * @param html - The HTML object being traversed
   */
  protected _saveScrollPositions(html: JQuery): void;

  /**
   * Restore the scroll positions of containers within the app after re-rendering the content
   * @param html - The HTML object being traversed
   */
  protected _restoreScrollPositions(html: JQuery): void;

  /**
   * Render the outer application wrapper
   * @returns A promise resolving to the constructed jQuery object
   */
  protected _renderOuter(): Promise<JQuery>;

  /**
   * Render the inner application content
   * @param data - The data used to render the inner template
   * @returns A promise resolving to the constructed jQuery object
   * @remarks Some subclasses do not return a promise but the jQuery object directly.
   * @internal
   */
  protected _renderInner(data: object): Promise<JQuery>;

  /**
   * Customize how inner HTML is replaced when the application is refreshed
   * @param element - The original HTML processed as a jQuery object
   * @param html    - New updated HTML as a jQuery object
   * @internal
   */
  protected _replaceHTML(element: JQuery, html: JQuery): void;

  /**
   * Customize how a new HTML Application is added and first appears in the DOC
   * @param html - The HTML element which is ready to be added to the DOM
   * @internal
   */
  protected _injectHTML(html: JQuery): void;

  /**
   * Specify the set of config buttons which should appear in the Application header.
   * Buttons should be returned as an Array of objects.
   * The header buttons which are added to the application can be modified by the getApplicationHeaderButtons hook.
   * @internal
   */
  protected _getHeaderButtons(): Application.HeaderButton[];

  /**
   * Create a {@link ContextMenu} for this Application.
   * @param html - The Application's HTML.
   * @internal
   */
  protected _contextMenu(html: JQuery): void;

  /**
   * Activate required listeners which must be enabled on every Application.
   * These are internal interactions which should not be overridden by downstream subclasses.
   */
  protected _activateCoreListeners(html: JQuery): void;

  /**
   * After rendering, activate event listeners which provide interactivity for the Application.
   * This is where user-defined Application subclasses should attach their event-handling logic.
   */
  activateListeners(html: JQuery): void;

  /**
   * Change the currently active tab
   * @param tabName - The target tab name to switch to
   * @param options - Options which configure changing the tab
   *                  (default: `{}`)
   */
  activateTab(
    tabName: string,
    options?: {
      /** A specific named tab group, useful if multiple sets of tabs are present */
      group?: string;
      /**
       * Whether to trigger tab-change callback functions
       * (default: `true`)
       */
      triggerCallback?: boolean;
    }
  ): void;

  /**
   * Handle changes to the active tab in a configured Tabs controller
   * @param event  - A left click event
   * @param tabs   - The Tabs controller
   * @param active - The new active tab name
   */
  protected _onChangeTab(event: MouseEvent | null, tabs: Tabs, active: string): void;

  /**
   * Handle changes to search filtering controllers which are bound to the Application
   * @param event - The key-up event from keyboard input
   * @param query - The regular expression to test against
   * @param rgx   - The regular expression to test against
   * @param html  - The HTML element which should be filtered
   */
  protected _onSearchFilter(event: KeyboardEvent, query: string, rgx: RegExp, html: HTMLElement): void;

  /**
   * Define whether a user is able to begin a dragstart workflow for a given drag selector
   * @param selector - The candidate HTML selector for dragging
   * @returns Can the current user drag this selector?
   */
  protected _canDragStart(selector: string): boolean;

  /**
   * Define whether a user is able to conclude a drag-and-drop workflow for a given drop selector
   * @param selector - The candidate HTML selector for the drop target
   * @returns Can the current user drop on this selector?
   */
  protected _canDragDrop(selector: string): boolean;

  /**
   * Callback actions which occur at the beginning of a drag start workflow.
   * @param event - The originating DragEvent
   */
  protected _onDragStart(event: DragEvent): void;

  /**
   * Callback actions which occur when a dragged element is over a drop target.
   * @param event - originating DragEvent
   */
  protected _onDragOver(event: DragEvent): void;

  /**
   * Callback actions which occur when a dragged element is dropped on a target.
   * @param event - The originating DragEvent
   */
  protected _onDrop(event: DragEvent): void;

  /**
   * Bring the application to the top of the rendering stack
   */
  bringToTop(): void;

  /**
   * Close the application and un-register references to it within UI mappings
   * This function returns a Promise which resolves once the window closing animation concludes
   * @param options - Options which affect how the Application is closed
   *                  (default: `{}`)
   * @returns A Promise which resolves once the application is closed
   */
  close(options?: Application.CloseOptions): Promise<void>;

  /**
   * Minimize the pop-out window, collapsing it to a small tab
   * Take no action for applications which are not of the pop-out variety or apps which are already minimized
   * @returns A Promise which resolves once the minimization action has completed
   */
  minimize(): Promise<void>;

  /**
   * Maximize the pop-out window, expanding it to its original size
   * Take no action for applications which are not of the pop-out variety or are already maximized
   * @returns A Promise which resolves once the maximization action has completed
   */
  maximize(): Promise<void>;

  /**
   * Set the application position and store it's new location.
   * Returns the updated position object for the application containing the new values.
   * @param position - Positional data
   */
  setPosition(
    position?: Partial<Omit<Application.Position, "zIndex">>
  ): (Application.Position & { height: number }) | void;

  /**
   * Handle application minimization behavior - collapsing content and reducing the size of the header
   */
  protected _onToggleMinimize(ev: Event): void;

  /**
   * Additional actions to take when the application window is resized
   */
  protected _onResize(event: Event): void;
}

declare namespace Application {
  interface CloseOptions {
    force?: boolean | undefined;
  }

  interface HeaderButton {
    label: string;
    class: string;
    icon: string;
    onclick: ((ev: JQuery.ClickEvent) => void) | null;
  }

  interface Position {
    /** The left offset position in pixels */
    left: number | null;

    /** The top offset position in pixels */
    top: number | null;

    /** The application width in pixels */
    width: number | null;

    /** The application height in pixels */
    height: number | null | "auto";

    /** The application scale as a numeric factor where 1.0 is default */
    scale: number | null;

    /** @defaultValue `0` */
    zIndex: number;
  }

  type RenderOptions<Options extends ApplicationOptions = ApplicationOptions> = Partial<Options> & {
    /**
     * The left positioning attribute
     */
    left?: number | null | undefined;

    /**
     * The top positioning attribute
     */
    top?: number | null | undefined;

    /**
     * The rendered width
     */
    width?: number | null | undefined;

    /**
     * The rendered height
     */
    height?: number | "auto" | null | undefined;

    /**
     * The rendered transformation scale
     */
    scale?: number | null | undefined;

    /**
     * Apply focus to the application, maximizing it and bringing it to the top
     * of the vertical stack.
     * @defaultValue `false`
     */
    focus?: boolean | undefined;

    /**
     * A context-providing string which suggests what event triggered the render
     */
    renderContext?: string | undefined;

    /**
     * The data change which motivated the render request
     */
    renderData?: object | undefined;
  };

  /**
   * @see {@link Application.RENDER_STATES}
   */
  type RenderState = ValueOf<typeof Application["RENDER_STATES"]>;
}
