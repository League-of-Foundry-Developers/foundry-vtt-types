import type {
  MustConform,
  AnyObject,
  DeepPartial,
  EmptyObject,
  InexactPartial,
  MaybePromise,
} from "../../../../utils/index.d.mts";
import type EventEmitterMixin from "../../../common/utils/event-emitter.d.mts";

// TODO: Investigate use of DeepPartial vs Partial vs InexactPartial

declare const __ApplicationV2Brand: unique symbol;

declare const __Configuration: unique symbol;
declare const __RenderOptions: unique symbol;
declare const __RenderContext: unique symbol;

type _ClassMustBeAssignableToInternal = MustConform<typeof ApplicationV2, ApplicationV2.Internal.Constructor>;
type _InstanceMustBeAssignableToInternal = MustConform<ApplicationV2, ApplicationV2.Internal.Instance.Any>;

declare namespace ApplicationV2 {
  type Any = ApplicationV2<any, any, any>;
  type AnyConstructor = typeof AnyApplicationV2;

  // Documented at https://gist.github.com/LukeAbby/c7420b053d881db4a4d4496b95995c98
  namespace Internal {
    type Constructor = (abstract new (arg0: never, ...args: never[]) => Instance.Any) & {
      [__ApplicationV2Brand]: never;
    };

    /**
     * This type is an internal implementation detail of fvtt-types.
     *
     * It is used in `HandlebarsApplicationMixin` as a proxy bound for `ApplicationV2`
     * as well as to implement generic passthrough from the mixin into the mixin
     * class.
     *
     * It soundly be used as a bound to guarantee a subclass of `ApplicationV2`
     * because it uses some `unique symbol`s that are used nowhere else in the
     * codebase.
     */
    interface Instance<
      Configuration extends ApplicationV2.Configuration,
      RenderOptions extends ApplicationV2.RenderOptions,
      RenderContext extends AnyObject,
    > {
      readonly [__Configuration]: Configuration;
      readonly [__RenderOptions]: RenderOptions;
      readonly [__RenderContext]: RenderContext;
    }

    namespace Instance {
      type Any = Instance<any, any, any>;
    }
  }

  export interface Configuration {
    /**
     * An HTML element identifier used for this Application instance
     */
    id: string;

    /**
     * An string discriminator substituted for \{id\} in the default
     * HTML element identifier for the class
     */
    uniqueId: string;

    /**
     * An array of CSS classes to apply to the Application
     */
    classes: string[];

    /**
     * The HTMLElement tag type used for the outer Application frame
     */
    tag: string;

    /**
     * Configuration of the window behaviors for this Application
     */
    window: WindowConfiguration;

    /**
     * Click actions supported by the Application and their event handler
     * functions. A handler function can be defined directly which only
     * responds to left-click events. Otherwise, an object can be declared
     * containing both a handler function and an array of buttons which are
     * matched against the PointerEvent#button property.
     */
    actions: Record<string, ClickAction | { handler: ClickAction; buttons: number[] }>;

    /**
     * Configuration used if the application top-level element is a form
     */
    form?: FormConfiguration;

    /**
     * Default positioning data for the application
     */
    position: Partial<Position>;
  }

  interface Position {
    /** Window offset pixels from top */
    top: number;

    /** Window offset pixels from left */
    left: number;

    /** Un-scaled pixels in width or "auto" */
    width: number | "auto";

    /** Un-scaled pixels in height or "auto" */
    height: number | "auto";

    /** A numeric scaling factor applied to application dimensions */
    scale: number;

    /** A z-index of the application relative to siblings */
    zIndex: number;
  }

  interface WindowConfiguration {
    /**
     * Is this Application rendered inside a window frame?
     * @defaultValue `true`
     */
    frame: boolean;

    /**
     * Can this Application be positioned via JavaScript or only by CSS
     * @defaultValue `true`
     */
    positioned: boolean;

    /** The window title. Displayed only if the application is framed */
    title: string;

    /** An optional Font Awesome icon class displayed left of the window title */
    icon: string | false;

    /** An array of window control entries */
    controls: HeaderControlsEntry[];

    /**
     * Can the window app be minimized by double-clicking on the title
     * @defaultValue `true`
     */
    minimizable: boolean;

    /**
     * Is this window resizable?
     * @defaultValue `false`
     */
    resizable: boolean;

    /**
     * A specific tag name to use for the .window-content element
     * @defaultValue `"section"`
     */
    contentTag: string;

    /** Additional CSS classes to apply to the .window-content element */
    contentClasses: string[];
  }

  interface FormConfiguration {
    handler: FormSubmission;

    submitOnChange: boolean;

    closeOnSubmit: boolean;
  }

  interface HeaderControlsEntry {
    /** A font-awesome icon class which denotes the control button */
    icon: string;

    /** The text label for the control button. This label will be automatically localized when the button is rendered */
    label: string;

    /** The action name triggered by clicking the control button */
    action: string;

    /** Is the control button visible for the current client? */
    visible?: boolean | undefined;

    /**
     * A key or value in CONST.DOCUMENT_OWNERSHIP_LEVELS that restricts visibility of this option for the current user.
     * This option only applies to DocumentSheetV2 instances.
     */
    ownership?: string | number | undefined;
  }

  interface ConstructorParams {
    position: Position;
  }

  interface RenderOptions {
    /**
     * Force application rendering. If true, an application which does not yet exist in the DOM is added.
     * If false, only applications which already exist are rendered.
     */
    force: boolean;

    /** A specific position at which to render the Application */
    position: Position;

    /** Updates to the Application window frame */
    window: WindowRenderOptions;

    /**
     * Some Application classes, for example the HandlebarsApplication,
     * support re-rendering a subset of application parts instead of the full Application HTML.
     */
    parts: string[];

    /** Is this render the first one for the application? This property is populated automatically. */
    isFirstRender: boolean;
  }

  interface WindowRenderOptions {
    /** Update the window title with a new value? */
    title: string;

    /** Update the window icon with a new value? */
    icon: string | false;

    /** Re-render the window controls menu? */
    controls: boolean;
  }

  interface ClosingOptions {
    /** Whether to animate the close, or perform it instantaneously */
    animate: boolean;

    /** Whether the application was closed via keypress. */
    closeKey: boolean;
  }

  /** An on-click action supported by the Application. Run in the context of a HandlebarsApplication. */
  type ClickAction = (
    /** The originating click event */
    event: PointerEvent,

    /** The capturing HTML element which defines the [data-action] */
    target: HTMLElement,
  ) => MaybePromise<void>;

  /** A form submission handler method. Run in the context of a HandlebarsApplication */
  type FormSubmission = (
    /** The originating form submission or input change event */
    event: SubmitEvent | Event,

    /** The form element that was submitted */
    form: HTMLFormElement,

    /** Processed data for the submitted form */
    formData: FormDataExtended,
  ) => MaybePromise<void>;

  /** @remarks Used with `templates/generic/tab-navigation.hbs` */
  interface Tab {
    id: string;
    group: string;
    icon: string;
    label: string;
    active: boolean;
    cssClass: string;
  }

  /** @remarks Used with `templates/generic/form-fields.hbs` */
  interface FormNode {
    fieldset: boolean;

    legend?: string | undefined;

    fields?: FormNode[] | undefined;

    field?: foundry.data.fields.DataField | undefined;

    value?: unknown;
  }

  /** @remarks Used with `templates/generic/form-footer.hbs` */
  interface FormFooterButton {
    type: HTMLButtonElement["type"];

    name?: string | undefined;

    icon?: string | undefined;

    label?: string | undefined;

    action?: string | undefined;

    cssClass?: string | undefined;

    /** @defaultValue `false` */
    disabled?: boolean | undefined;
  }

  interface ChangeTabOptions
    extends InexactPartial<{
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
    }> {}
}

/**
 * The Application class is responsible for rendering an HTMLElement into the Foundry Virtual Tabletop user interface.
 */
declare class ApplicationV2<
  // Foundry doesn't define this generic in its documentation but it's necessary
  // in fvtt-types to type `_prepareContext` etc.
  RenderContext extends AnyObject = EmptyObject,
  Configuration extends ApplicationV2.Configuration = ApplicationV2.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends EventEmitterMixin(Object) {
  static [__ApplicationV2Brand]: never;

  [__Configuration]: Configuration;
  [__RenderOptions]: RenderOptions;
  [__RenderContext]: RenderContext;

  constructor(options?: DeepPartial<Configuration>);

  static BASE_APPLICATION: typeof ApplicationV2;

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  static DEFAULT_OPTIONS: DeepPartial<ApplicationV2.Configuration> & object;

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
  options: Readonly<Configuration>;

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
    pointerStartPosition: ApplicationV2.Position | undefined;
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
  position: ApplicationV2.Position;

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
  static inheritanceChain(): Generator<ApplicationV2.AnyConstructor>;

  /**
   * Initialize configuration options for the Application instance.
   * The default behavior of this method is to intelligently merge options for each class with those of their parents.
   * - Array-based options are concatenated
   * - Inner objects are merged
   * - Otherwise, properties in the subclass replace those defined by a parent
   * @param options - Options provided directly to the constructor
   * @returns Configured options for the application instance
   */
  protected _initializeApplicationOptions(options: DeepPartial<Configuration>): Configuration;

  /**
   * Render the Application, creating its HTMLElement and replacing its innerHTML.
   * Add it to the DOM if it is not currently rendered and rendering is forced. Otherwise, re-render its contents.
   * @param options  - Options which configure application rendering behavior.
   *                   A boolean is interpreted as the "force" option.
   * @returns A Promise which resolves to the rendered Application instance
   */
  render(options?: DeepPartial<RenderOptions>): Promise<this>;

  /**
   * @deprecated Exists for backwards compatability with the original `ApplicationV1#render` signature.
   *
   * @param _options - Legacy options for backwards-compatibility with the original ApplicationV1#render signature.
   */
  render(options: boolean, _options?: DeepPartial<RenderOptions>): Promise<this>;

  /**
   * Modify the provided options passed to a render request.
   * @param options - Options which configure application rendering behavior
   */
  protected _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  /**
   * Prepare application rendering context data for a given render request.
   * @param options - Options which configure application rendering behavior
   * @returns Context data for the render operation
   */
  protected _prepareContext(options: DeepPartial<RenderOptions> & { isFirstRender: boolean }): Promise<RenderContext>;

  /**
   * Configure the array of header control menu options
   */
  protected _getHeaderControls(): ApplicationV2.HeaderControlsEntry[];

  /**
   * Iterate over header control buttons, filtering for controls which are visible for the current client.
   */
  protected _headerControlsButtons(): Generator<ApplicationV2.HeaderControlsEntry>;

  /**
   * Render an HTMLElement for the Application.
   * An Application subclass must implement this method in order for the Application to be renderable.
   * @param context - Context data for the render operation
   * @param options - Options which configure application rendering behavior
   * @returns The result of HTML rendering may be implementation specific.
   *          Whatever value is returned here is passed to _replaceHTML
   */
  protected _renderHTML(context: RenderContext, options: DeepPartial<RenderOptions>): Promise<unknown>;

  /**
   * Replace the HTML of the application with the result provided by the rendering backend.
   * An Application subclass should implement this method in order for the Application to be renderable.
   * @param result  - The result returned by the application rendering backend
   * @param content - The content element into which the rendered result must be inserted
   * @param options - Options which configure application rendering behavior
   */
  protected _replaceHTML(result: unknown, content: HTMLElement, options: DeepPartial<RenderOptions>): void;

  /**
   * Render the outer framing HTMLElement which wraps the inner HTML of the Application.
   * @param options - Options which configure application rendering behavior
   */
  protected _renderFrame(options: DeepPartial<RenderOptions>): Promise<HTMLElement>;

  /**
   * Render a header control button.
   */
  protected _renderHeaderControl(control: ApplicationV2.HeaderControlsEntry): HTMLLIElement;

  /**
   * When the Application is rendered, optionally update aspects of the window frame.
   * @param options - Options provided at render-time
   */
  protected _updateFrame(options: DeepPartial<RenderOptions>): void;

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
  close(options?: DeepPartial<ApplicationV2.ClosingOptions>): Promise<this>;

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
  setPosition(position: DeepPartial<ApplicationV2.Position>): ApplicationV2.Position;

  /**
   * Translate a requested application position updated into a resolved allowed position for the Application.
   * Subclasses may override this method to implement more advanced positioning behavior.
   * @param position - Requested Application positioning data
   * @returns Resolved Application positioning data
   */
  protected _updatePosition(position: ApplicationV2.Position): ApplicationV2.Position;

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
   * @remarks InexactPartial is used over NullishProps because event/navElement are not called with null as a possible value,
   *          and null interferes with the defaults of force/updatePosition
   */
  changeTab(tab: string, group: string, options?: ApplicationV2.ChangeTabOptions): void;

  /**
   * Test whether this Application is allowed to be rendered.
   * @param options - Provided render options
   * @returns Return false to prevent rendering
   * @throws An Error to display a warning message
   */
  protected _canRender(options: DeepPartial<RenderOptions>): false | void;

  /**
   * Actions performed before a first render of the Application.
   * @param context - Prepared context data
   * @param options - Provided render options
   */
  protected _preFirstRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Actions performed after a first render of the Application.
   * Post-render steps are not awaited by the render process.
   * @param context - Prepared context data
   * @param options - Provided render options
   */
  protected _onFirstRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): void;

  /**
   * Actions performed before any render of the Application.
   * Pre-render steps are awaited by the render process.
   * @param context - Prepared context data
   * @param options - Provided render options
   */
  protected _preRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Actions performed after any render of the Application.
   * Post-render steps are not awaited by the render process.
   * @param context - Prepared context data
   * @param options - Provided render options
   */
  protected _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): void;

  /**
   * Actions performed before closing the Application.
   * Pre-close steps are awaited by the close process.
   * @param options - Provided render options
   */
  protected _preClose(options: DeepPartial<RenderOptions>): Promise<void>;

  /**
   * Actions performed after closing the Application.
   * Post-close steps are not awaited by the close process.
   * @param options - Provided render options
   */
  protected _onClose(options: DeepPartial<RenderOptions>): void;

  /**
   * Actions performed before the Application is re-positioned.
   * Pre-position steps are not awaited because setPosition is synchronous.
   * @param options - Provided render options
   */
  protected _prePosition(options: DeepPartial<RenderOptions>): void;

  /**
   * Actions performed after the Application is re-positioned.
   * @param options - Provided render options
   */
  protected _onPosition(options: DeepPartial<RenderOptions>): void;

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
  protected _onSubmitForm(formConfig: ApplicationV2.FormConfiguration, event: Event | SubmitEvent): Promise<void>;

  /**
   * Handle changes to an input element within the form.
   * @param formConfig - The form configuration for which this handler is bound
   * @param event      - The form submission event
   */
  _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

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

declare abstract class AnyApplicationV2 extends ApplicationV2<any, any, any> {
  constructor(arg0: never, ...args: never[]);
}

export default ApplicationV2;
