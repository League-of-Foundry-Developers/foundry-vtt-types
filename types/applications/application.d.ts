interface ApplicationOptions extends Object {
  [key: string]: any
  /** A named "base application" which generates an additional hook */
  baseApplication?: string
  /** An array of CSS string classes to apply to the rendered HTML */
  classes?: string[]
  /** The default pixel height for the rendered HTML */
  height?: number | string
  /** The default CSS id to assign to the rendered HTML */
  id?: string
  /** The default offset-left position for the rendered HTML */
  left?: number
  /** Whether the rendered application can be minimized (popOut only) */
  minimizable?: boolean
  /** Whether to display the application as a pop-out container */
  popOut?: boolean
  /** Whether the rendered application can be drag-resized (popOut only) */
  resizable?: boolean
  /**
   * A list of unique CSS selectors which target containers that should
   * have their vertical scroll positions preserved during a re-render.
   */
  scrollY?: string[]
  /** Track Tab navigation handlers which are active for this Application */
  tabs?: TabV2Options[]
  /** The default HTML template path to render for this Application */
  template?: string
  /** A default window title string (popOut only) */
  title?: string
  /** The default offset-top position for the rendered HTML */
  top?: number
  /** The default pixel width for the rendered HTML */
  width?: number | string
}

interface RenderOptions extends Object {
  /** The rendered height */
  height?: number
  /** The left positioning attribute */
  left?: number
  /** Whether to display a log message that the Application was rendered */
  log?: boolean
  /** A context-providing string which suggests what event triggered the render */
  renderContext?: string
  /** The data change which motivated the render request */
  renderData?: any
  /** The rendered transformation scale */
  scale?: number
  /** The top positioning attribute */
  top?: number
  /** The rendered width */
  width?: number
}

interface ApplicationPosition extends Object {
  height?: number | string
  left?: number
  scale?: number
  top?: number
  width?: number | string
}

declare const MIN_WINDOW_WIDTH: number, MIN_WINDOW_HEIGHT: number

declare let _appId: number
declare let _maxZ: number

/**
 * The standard application window that is rendered for a large variety of UI elements in Foundry VTT
 */
declare class Application {
  protected static RENDER_STATES: any

  /**
   * The application ID is a unique incrementing integer which is used to identify every application window
   * drawn by the VTT
   */
  appId: number

  /**
   * The options provided to this application upon initialization
   */
  options: ApplicationOptions

  /**
   * Track the current position and dimensions of the Application UI
   */
  position: ApplicationPosition

  /**
   * DragDrop workflow handlers which are active for this Application
   */
  protected _dragDrop: DragDrop[]

  /**
   * An internal reference to the HTML element this application renders
   */
  protected _element: JQuery

  /**
   * Track whether the Application is currently minimized
   */
  protected _minimized: boolean

  /**
   * Track the most recent scroll positions for any vertically scrolling containers
   */
  protected _scrollPositions: any | null

  /**
   * Track the render state of the Application
   * @see {@link Application.RENDER_STATES}
   */
  protected _state: any

  /**
   * Tab navigation handlers which are active for this Application
   */
  protected _tabs: TabsV2[]

  constructor (options?: ApplicationOptions)

  /**
   * Assign the default options which are supported by all Application classes.
   * Application subclasses may include additional options which are specific to their usage.
   * All keys are optional, descriptions and default values are listed below:
   */
  static get defaultOptions (): ApplicationOptions

  /**
   * Return the active application element, if it currently exists in the DOM
   */
  get element (): JQuery | HTMLElement

  /**
   * Return the CSS application ID which uniquely references this UI element
   */
  get id (): string

  /**
   * Control the rendering style of the application. If popOut is true, the application is rendered in its own
   * wrapper window, otherwise only the inner app content is rendered
   */
  get popOut (): boolean

  /**
   * Return a flag for whether the Application instance is currently rendered
   */
  get rendered (): boolean

  /**
   * The path to the HTML template file which should be used to render the inner content of the app
   */
  get template (): string

  /**
   * An Application window should define its own title definition logic which may be dynamic depending on its data
   */
  get title (): string

  /**
   * Close the application and un-register references to it within UI mappings
   * This function returns a Promise which resolves once the window closing animation concludes
   */
  close (): Promise<any>

  /**
   * An application should define the data object used to render its template.
   * This function may either return an Object directly, or a Promise which resolves to an Object
   * If undefined, the default implementation will return an empty object allowing only for rendering of static HTML
   */
  getData (options?: any): any | Promise<any>

  /**
   * Maximize the pop-out window, expanding it to its original size
   * Take no action for applications which are not of the pop-out variety or are already maximized
   * @returns A Promise which resolves to true once the maximization action has completed
   */
  maximize (): Promise<boolean>

  /**
   * Minimize the pop-out window, collapsing it to a small tab
   * Take no action for applications which are not of the pop-out variety or apps which are already minimized
   * @returns A Promise which resolves to true once the minimization action has completed
   */
  minimize (): Promise<boolean>

  /**
   * Render the Application by evaluating it's HTML template against the object of data provided by the getData method
   * If the Application is rendered as a pop-out window, wrap the contained HTML in an outer frame with window controls
   * @param force - Add the rendered application to the DOM if it is not already present. If false, the
   *                Application will only be re-rendered if it is already present.
   * @param options - Additional rendering options which are applied to customize the way that the Application
   *                  is rendered in the DOM.
   */
  render (force?: boolean, options?: RenderOptions): Application

  /**
   * Set the application position and store it's new location
   */
  setPosition ({ left, top, width, height, scale }: ApplicationPosition): any

  /**
   * Define whether a user is able to conclude a drag-and-drop workflow for a given drop selector
   * @param selector - The candidate HTML selector for the drop target
   * @returns Can the current user drop on this selector?
   */
  protected _canDragDrop (selector: string): boolean

  /**
   * Define whether a user is able to begin a dragstart workflow for a given drag selector
   * @param selector - The candidate HTML selector for dragging
   * @returns Can the current user drag this selector?
   */
  protected _canDragStart (selector: string): boolean

  /**
   * Create drag-and-drop workflow handlers for this Application
   * @returns An array of DragDrop handlers
   */
  protected _createDragDropHandlers (): DragDrop[]

  /**
   * Create tabbed navigation handlers for this Application
   * @returns An array of TabsV2 handlers
   */
  protected _createTabHandlers (): TabsV2[]

  /**
   * Specify the set of config buttons which should appear in the Application header
   * Buttons should be returned as an Array of Objects with the following keys:
   * label: The button label
   * icon: A font-awesome glyph icon
   * class: the css class of the button
   * onclick: the button click handler
   */
  protected _getHeaderButtons (): any[]

  /**
   * Customize how a new HTML Application is added and first appears in the DOC
   */
  protected _injectHTML (html: JQuery | HTMLElement, options: any): void

  /**
   * Handle changes to the active tab in a configured Tabs controller
   * @param event - A left click event
   * @param tabs - The TabsV2 controller
   * @param active - The new active tab name
   */
  protected _onChangeTab (
    event: MouseEvent,
    tabs: TabsV2,
    active: string
  ): void

  /**
   * Callback actions which occur when a dragged element is over a drop target.
   * @param event - The originating DragEvent
   */
  protected _onDragOver (event: DragEvent): void

  /**
   * Callback actions which occur at the beginning of a drag start workflow.
   * @param event - The originating DragEvent
   */
  protected _onDragStart (event: DragEvent): void

  /**
   * Callback actions which occur when a dragged element is dropped on a target.
   * @param event - The originating DragEvent
   */
  protected _onDrop (event: DragEvent): void

  /**
   * Additional actions to take when the application window is resized
   */
  protected _onResize (event: Event | JQuery.Event): void

  /**
   * Handle application minimization behavior - collapsing content and reducing the size of the header
   */
  protected _onToggleMinimize (ev: Event | JQuery.Event): void

  /**
   * An asynchronous inner function which handles the rendering of the Application
   * @param options - Provided rendering options, see the render function for details
   */
  protected _render (force?: boolean, options?: any): void

  /**
   * Render the inner application content
   * @param data - The data used to render the inner template
   * @returns A promise resolving to the constructed jQuery object
   */
  protected _renderInner (
    data: any,
    options: any
  ): Promise<JQuery | HTMLElement>

  /**
   * Render the outer application wrapper
   * @returns - A promise resolving to the constructed jQuery object
   */
  protected _renderOuter (options: any): Promise<JQuery | HTMLElement>

  /**
   * Customize how inner HTML is replaced when the application is refreshed
   * @param element - The original HTML element
   * @param html - New updated HTML
   */
  protected _replaceHTML (
    element: JQuery | HTMLElement,
    html: JQuery | HTMLElement,
    options: any
  ): void

  /**
   * Restore the scroll positions of containers within the app after re-rendering the content
   */
  protected _restoreScrollPositions (
    html: HTMLElement | JQuery,
    selectors: string[]
  ): void

  /**
   * Persist the scroll positions of containers within the app before re-rendering the content
   */
  protected _saveScrollPositions (
    html: HTMLElement | JQuery,
    selectors: string[]
  ): void

  /**
   * Once the HTML for an Application has been rendered, activate event listeners which provide interactivity for
   * the application
   */
  protected activateListeners (html: JQuery | HTMLElement): void
}
