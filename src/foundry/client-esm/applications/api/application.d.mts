import type EventEmitterMixin from "../../../common/utils/event-emitter.d.mts";
import type { ApplicationConfiguration, ApplicationPosition } from "../_types.d.mts";

/**
 * The Application class is responsible for rendering an HTMLElement into the Foundry Virtual Tabletop user interface.
 */
export default class ApplicationV2 extends EventEmitterMixin(Object) {
  constructor(options: Partial<ApplicationConfiguration>);

  static BASE_APPLICATION: typeof ApplicationV2;

  static DEFAULT_OPTIONS: Partial<ApplicationConfiguration>;

  static readonly RENDER_STATES: {
    ERROR: -3;
    CLOSING: -2;
    CLOSED: -1;
    NONE: 0;
    RENDERING: 1;
    RENDERED: 2;
  };

  static readonly emittedEvents: ["render", "close", "position"];

  options: Partial<ApplicationConfiguration>;

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
}
