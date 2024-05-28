import type { DeepPartial, InexactPartial } from "../../../../types/utils.d.mts";
import type EventEmitterMixin from "../../../common/utils/event-emitter.d.mts";
import type {
  ApplicationClosingOptions,
  ApplicationConfiguration,
  ApplicationFormConfiguration,
  ApplicationHeaderControlsEntry,
  ApplicationPosition,
  ApplicationRenderContext,
  ApplicationRenderOptions,
} from "../_types.d.mts";

// TODO: Investigate use of DeepPartial vs Partial vs InexactPartial

/**
 * The Application class is responsible for rendering an HTMLElement into the Foundry Virtual Tabletop user interface.
 */
export default class ApplicationV2 extends EventEmitterMixin(Object) {
  constructor(options: DeepPartial<ApplicationConfiguration>);

  static BASE_APPLICATION: typeof ApplicationV2;

  static DEFAULT_OPTIONS: DeepPartial<ApplicationConfiguration>;

  static readonly RENDER_STATES: {
    ERROR: -3;
    CLOSING: -2;
    CLOSED: -1;
    NONE: 0;
    RENDERING: 1;
    RENDERED: 2;
  };

  static override readonly emittedEvents: ["render", "close", "position"];

  /**
   * Application instance configuration options.
   */
  options: DeepPartial<ApplicationConfiguration>;

  /**
   * Convenience references to window header elements.
   */
  get window(): {
    header?: HTMLElement | undefined;
    resize?: HTMLElement | undefined;
    title: HTMLHeadingElement | undefined;
    icon: HTMLElement | undefined;
    close: HTMLButtonElement | undefined;
    controls: HTMLButtonElement | undefined;
    controlsDropdown: HTMLDivElement | undefined;
    onDrag: (event: PointerEvent) => void;
    onResize: (event: PointerEvent) => void;
    pointerStartPosition: ApplicationPosition | undefined;
    pointerMoveThrottle: boolean;
  };

  /**
   * If this Application uses tabbed navigation groups, this mapping is updated whenever the changeTab method is called.
   * Reports the active tab for each group.
   * Subclasses may override this property to define default tabs for each group.
   */
  tabGroups: Record<string, string>;

  /**
   * The CSS class list of this Application instance
   */
  get classList(): DOMTokenList;

  /**
   * The HTML element ID of this Application instance.
   */
  get id(): string;

  /**
   * A convenience reference to the title of the Application window.
   */
  get title(): string;

  /**
   * The HTMLElement which renders this Application into the DOM.
   */
  get element(): HTMLElement;

  /**
   * Is this Application instance currently minimized?
   */
  get minimized(): boolean;

  /**
   * The current position of the application with respect to the window.document.body.
   */
  position: ApplicationPosition;

  /**
   * Is this Application instance currently rendered?
   */
  get rendered(): boolean;

  /**
   * The current render state of the Application.
   */
  get state(): typeof ApplicationV2.RENDER_STATES;

  /**
   * Does this Application instance render within an outer window frame?
   */
  get hasFrame(): boolean;

  /**
   * Iterate over the inheritance chain of this Application.
   * The chain includes this Application itself and all parents until the base application is encountered.
   */
  static inheritanceChain(): Generator<typeof ApplicationV2>;

  /**
   * Initialize configuration options for the Application instance.
   * The default behavior of this method is to intelligently merge options for each class with those of their parents.
   * - Array-based options are concatenated
   * - Inner objects are merged
   * - Otherwise, properties in the subclass replace those defined by a parent
   * @param options - Options provided directly to the constructor
   * @returns Configured options for the application instance
   */
  protected _initializeApplicationOptions(
    options: DeepPartial<ApplicationConfiguration>,
  ): DeepPartial<ApplicationConfiguration> & Record<string, unknown>;

  /**
   * Render the Application, creating its HTMLElement and replacing its innerHTML.
   * Add it to the DOM if it is not currently rendered and rendering is forced. Otherwise, re-render its contents.
   * @param options  - Options which configure application rendering behavior.
   *                   A boolean is interpreted as the "force" option.
   * @param _options - Legacy options for backwards-compatibility with the original
   *                   ApplicationV1#render signature.
   * @returns A Promise which resolves to the rendered Application instance
   */
  render(
    options?: DeepPartial<ApplicationConfiguration> | boolean,
    _options?: DeepPartial<ApplicationRenderOptions>,
  ): Promise<this>;

  /**
   * Modify the provided options passed to a render request.
   * @param options - Options which configure application rendering behavior
   */
  protected _configureRenderOptions(options: DeepPartial<ApplicationRenderOptions>): void;

  /**
   * Prepare application rendering context data for a given render request.
   * @param options - Options which configure application rendering behavior
   * @returns Context data for the render operation
   */
  protected _prepareContext(options: DeepPartial<ApplicationRenderOptions>): Promise<ApplicationRenderContext>;

  /**
   * Configure the array of header control menu options
   */
  protected _getHeaderControls(): ApplicationHeaderControlsEntry[];

  /**
   * Iterate over header control buttons, filtering for controls which are visible for the current client.
   */
  protected _headerControlsButtons(): Generator<ApplicationHeaderControlsEntry>;

  /**
   * Render an HTMLElement for the Application.
   * An Application subclass must implement this method in order for the Application to be renderable.
   * @param context - Context data for the render operation
   * @param options - Options which configure application rendering behavior
   * @returns The result of HTML rendering may be implementation specific.
   *          Whatever value is returned here is passed to _replaceHTML
   */
  protected _renderHTML(
    context: ApplicationRenderContext,
    options: DeepPartial<ApplicationRenderOptions>,
  ): Promise<any>; //TODO: Might be the subject of a generic?

  /**
   * Replace the HTML of the application with the result provided by the rendering backend.
   * An Application subclass should implement this method in order for the Application to be renderable.
   * @param result  - The result returned by the application rendering backend
   * @param content - The content element into which the rendered result must be inserted
   * @param options - Options which configure application rendering behavior
   */
  protected _replaceHTML(
    // TODO: Ignore warning?
    result: Awaited<ReturnType<this["_renderHTML"]>>,
    content: HTMLElement,
    options: DeepPartial<ApplicationRenderOptions>,
  ): void;

  /**
   * Render the outer framing HTMLElement which wraps the inner HTML of the Application.
   * @param options - Options which configure application rendering behavior
   */
  protected _renderFrame(options: DeepPartial<ApplicationRenderOptions>): Promise<HTMLElement>;

  /**
   * Render a header control button.
   */
  protected _renderHeaderControl(control: ApplicationHeaderControlsEntry): HTMLLIElement;

  /**
   * When the Application is rendered, optionally update aspects of the window frame.
   * @param options - Options provided at render-time
   */
  protected _updateFrame(options: DeepPartial<ApplicationRenderOptions>): void;

  /**
   * Insert the application HTML element into the DOM.
   * Subclasses may override this method to customize how the application is inserted.
   * @param element - The element to insert
   * @returns The inserted element
   */
  // TODO: Actual function def appears to be void?
  protected _insertElement(element: HTMLElement): HTMLElement;

  /**
   * Close the Application, removing it from the DOM.
   * @param options - Options which modify how the application is closed.
   * @returns A Promise which resolves to the closed Application instance
   */
  close(options?: DeepPartial<ApplicationClosingOptions>): Promise<this>;

  /**
   * Remove the application HTML element from the DOM.
   * Subclasses may override this method to customize how the application element is removed.
   * @param element - The element to be removed
   */
  protected _removeElement(element: HTMLElement): void;

  /**
   * Update the Application element position using provided data which is merged with the prior position.
   * @param position - New Application positioning data
   */
  setPosition(position: DeepPartial<ApplicationPosition>): ApplicationPosition;

  /**
   * Translate a requested application position updated into a resolved allowed position for the Application.
   * Subclasses may override this method to implement more advanced positioning behavior.
   * @param position - Requested Application positioning data
   * @returns Resolved Application positioning data
   */
  protected _updatePosition(position: ApplicationPosition): ApplicationPosition;

  /**
   * Toggle display of the Application controls menu.
   * Only applicable to window Applications.
   * @param expanded - Set the controls visibility to a specific state.
   *                   Otherwise, the visible state is toggled from its current value
   */
  toggleControls(expanded?: boolean): void;

  /**
   * Minimize the Application, collapsing it to a minimal header.
   */
  minimize(): Promise<void>;

  /**
   * Restore the Application to its original dimensions.
   */
  maximize(): Promise<void>;

  /**
   * Bring this Application window to the front of the rendering stack by increasing its z-index.
   * Once ApplicationV1 is deprecated we should switch from _maxZ to ApplicationV2#maxZ
   * We should also eliminate ui.activeWindow in favor of only ApplicationV2#frontApp
   */
  bringToFront(): void;

  /**
   * Change the active tab within a tab group in this Application instance.
   * @param tab     - The name of the tab which should become active
   * @param group   - The name of the tab group which defines the set of tabs
   * @param options - Additional options which affect tab navigation
   */
  changeTab(
    tab: string,
    group: string,
    options?: InexactPartial<{
      /**
       * An interaction event which caused the tab change, if any
       */
      event: Event;
      /**
       * An explicit navigation element being modified
       */
      navElement: HTMLElement;
      /**
       * Force changing the tab even if the new tab is already active
       * @defaultValue `false`
       */
      force: boolean;
      /**
       * Update application position after changing the tab?
       * @defaultValue `false`
       */
      updatePosition: boolean;
    }>,
  ): void;

  /**
   * Test whether this Application is allowed to be rendered.
   * @param options - Provided render options
   * @returns Return false to prevent rendering
   * @throws An Error to display a warning message
   */
  protected _canRender(options: DeepPartial<ApplicationRenderOptions>): false | void;

  /**
   * Actions performed before a first render of the Application.
   * @param context - Prepared context data
   * @param options - Provided render options
   */
  protected _preFirstRender(
    context: DeepPartial<ApplicationRenderContext>,
    options: DeepPartial<ApplicationRenderOptions>,
  ): Promise<void>;

  /**
   * Actions performed after a first render of the Application.
   * Post-render steps are not awaited by the render process.
   * @param context - Prepared context data
   * @param options - Provided render options
   */
  protected _onFirstRender(
    context: DeepPartial<ApplicationRenderContext>,
    options: DeepPartial<ApplicationRenderOptions>,
  ): void;

  /**
   * Actions performed before any render of the Application.
   * Pre-render steps are awaited by the render process.
   * @param context - Prepared context data
   * @param options - Provided render options
   */
  protected _preRender(
    context: DeepPartial<ApplicationRenderContext>,
    options: DeepPartial<ApplicationRenderOptions>,
  ): Promise<void>;

  /**
   * Actions performed after any render of the Application.
   * Post-render steps are not awaited by the render process.
   * @param context - Prepared context data
   * @param options - Provided render options
   */
  protected _onRender(
    context: DeepPartial<ApplicationRenderContext>,
    options: DeepPartial<ApplicationRenderOptions>,
  ): void;

  /**
   * Actions performed before closing the Application.
   * Pre-close steps are awaited by the close process.
   * @param options - Provided render options
   */
  protected _preClose(options: DeepPartial<ApplicationRenderOptions>): Promise<void>;

  /**
   * Actions performed after closing the Application.
   * Post-close steps are not awaited by the close process.
   * @param options - Provided render options
   */
  protected _onClose(options: DeepPartial<ApplicationRenderOptions>): void;

  /**
   * Actions performed before the Application is re-positioned.
   * Pre-position steps are not awaited because setPosition is synchronous.
   * @param options - Provided render options
   */
  protected _prePosition(options: DeepPartial<ApplicationRenderOptions>): void;

  /**
   * Actions performed after the Application is re-positioned.
   * @param options - Provided render options
   */
  protected _onPosition(options: DeepPartial<ApplicationRenderOptions>): void;

  /**
   * Attach event listeners to the Application frame.
   */
  protected _attachFrameListeners(): void;

  /**
   * A generic event handler for action clicks which can be extended by subclasses.
   * Action handlers defined in DEFAULT_OPTIONS are called first. This method is only called for actions which have
   * no defined handler.
   * @param event  - The originating click event
   * @param target - The capturing HTML element which defined a [data-action]
   */
  protected _onClickAction(event: PointerEvent, target: HTMLElement & { dataset: { action: string } }): void;

  /**
   * Handle submission for an Application which uses the form element.
   * @param formConfig - The form configuration for which this handler is bound
   * @param event      - The form submission event
   */
  protected _onSubmitForm(formConfig: ApplicationFormConfiguration, event: Event | SubmitEvent): Promise<void>;

  /**
   * Handle changes to an input element within the form.
   * @param formConfig - The form configuration for which this handler is bound
   * @param event      - The form submission event
   */
  _onChangeForm(formConfig: ApplicationFormConfiguration, event: Event): void;

  /**
   * Parse a CSS style rule into a number of pixels which apply to that dimension.
   * @param style           - The CSS style rule
   * @param parentDimension - The relevant dimension of the parent element
   * @returns The parsed style dimension in pixels
   */
  static parseCSSDimensions(style: string, parentDimension: number): number;

  /**
   * Wait for a CSS transition to complete for an element.
   * @param element - The element which is transitioning
   * @param timeout - A timeout in milliseconds in case the transitionend event does not occur
   * @internal
   */
  protected _awaitTransition(element: HTMLElement, timeout: number): Promise<void>;

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks `"ApplicationV2#bringToTop is not a valid function and redirects to ApplicationV2#bringToFront. This shim will be removed in v14."`
   */
  bringToTop(): void;
}
