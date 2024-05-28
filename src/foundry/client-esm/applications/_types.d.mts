// Open question - this is just types?

export interface ApplicationConfiguration {
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
  window: ApplicationWindowConfiguration;
  /**
   * Click actions supported by the Application and their event handler
   * functions. A handler function can be defined directly which only
   * responds to left-click events. Otherwise, an object can be declared
   * containing both a handler function and an array of buttons which are
   * matched against the PointerEvent#button property.
   */
  actions: Record<string, ApplicationClickAction | { handler: ApplicationClickAction; buttons: number[] }>;
  /**
   * Configuration used if the application top-level element is a form
   */
  form?: ApplicationFormConfiguration;
  /**
   * Default positioning data for the application
   */
  position: Partial<ApplicationPosition>;
}

export type ApplicationPosition = {
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
};

export type ApplicationWindowConfiguration = {};

export type ApplicationFormConfiguration = {};

export type ApplicationHeaderControlsEntry = {};

export type ApplicationConstructionParams = {
  position: ApplicationPosition;
};

export type ApplicationRenderOptions = {};

export type ApplicationWindowRenderOptions = {};

/**
 * Context data provided to the renderer
 */
export interface ApplicationRenderContext extends Record<string, any> {}

export type ApplicationClosingOptions = {};

export type ApplicationClickAction = (event: PointerEvent, target: HTMLElement) => Promise<void>;

export type ApplicationFormSubmission = () => Promise<void>;

export type ApplicationTab = {};

export type FormNode = {};

export type FormFooterButton = {};
