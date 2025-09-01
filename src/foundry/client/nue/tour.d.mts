import type { Identity, InexactPartial, ValueOf } from "#utils";
import type { ClientKeybindings, TooltipManager } from "#client/helpers/interaction/_module.d.mts";
import type { Localization } from "#client/helpers/_module.d.mts";

/**
 * A Tour that shows a series of guided steps.
 */
declare class Tour {
  /**
   * Construct a Tour by providing a configuration.
   * @param config  - The configuration of the Tour
   * @param options - Additional options for configuring the tour (default: `{}`)
   */
  constructor(config: Tour.Config, options?: Tour.ConstructorOptions);

  /** @remarks Frozen */
  static STATUS: Tour.Status;

  /**
   * Indicates if a Tour is currently in progress.
   */
  static get tourInProgress(): boolean;

  /**
   * Returns the active Tour, if any
   */
  static get activeTour(): Tour | null;

  /**
   * Handle a movement action to either progress or regress the Tour
   * @param movementDirections - The Directions being moved in
   * @remarks This method's one call in core is by full path name inside `ClientKeybindings##onPan`, so extending in subclasses has no effect
   */
  static onMovementAction(movementDirections: ClientKeybindings.MOVEMENT_DIRECTIONS[]): true | void;

  /**
   * Configuration of the tour. This object is cloned to avoid mutating the original configuration.
   */
  config: Tour.Config;

  /**
   * The HTMLElement which is the focus of the current tour step.
   * @remarks Only `undefined` prior to Tour {@linkcode start}
   */
  targetElement: HTMLElement | undefined | null;

  /**
   * The HTMLElement that fades out the rest of the screen
   */
  fadeElement: HTMLElement | undefined;

  /**
   * The HTMLElement that blocks input while a Tour is active
   */
  overlayElement: HTMLElement | undefined;

  /**
   * Padding around a Highlighted Element
   * @defaultValue `10`
   */
  static HIGHLIGHT_PADDING: number;

  /**
   * The unique identifier of the tour
   */
  get id(): string;

  set id(value: string);

  /**
   * The human-readable title for the tour.
   */
  get title(): string;

  /**
   * The human-readable description of the tour.
   */
  get description(): string | undefined;

  /**
   * The package namespace for the tour.
   */
  get namespace(): string;

  set namespace(value: string);

  /**
   * The key the Tour is stored under in game.tours, of the form `${namespace}.${id}`
   */
  get key(): string;

  /**
   * The configuration of tour steps
   */
  get steps(): Tour.Step[];

  /**
   * Return the current Step, or null if the tour has not yet started.
   */
  get currentStep(): Tour.Step | null;

  /**
   * The index of the current step; -1 if the tour has not yet started, or null if the tour is finished.
   */
  get stepIndex(): number | null;

  /**
   * Returns True if there is a next TourStep
   */
  get hasNext(): boolean;

  /**
   * Returns True if there is a previous TourStep
   */
  get hasPrevious(): boolean;

  /**
   * Return whether this Tour is currently eligible to be started?
   * This is useful for tours which can only be used in certain circumstances, like if the canvas is active.
   */
  get canStart(): boolean;

  /**
   * The current status of the Tour
   */
  get status(): Tour.STATUS;

  /**
   * Advance the tour to a completed state.
   */
  complete(): Promise<void>;

  /**
   * Exit the tour at the current step.
   */
  exit(): void;

  /**
   * Reset the Tour to an un-started state.
   */
  reset(): Promise<void>;

  /**
   * Start the Tour at its current step, or at the beginning if the tour has not yet started.
   */
  start(): Promise<void>;

  /**
   * Progress the Tour to the next step.
   */
  next(): Promise<void>;

  /**
   * Reward the Tour to the previous step.
   */
  previous(): Promise<void>;

  /**
   * Progresses to a given Step
   * @param stepIndex - The step to progress to
   * @remarks
   * @throws If `stepIndex` is outside the range `[0, this.steps.length]`
   */
  progress(stepIndex: number): Promise<void>;

  /**
   * Query the DOM for the target element using the provided selector
   * @param selector - A CSS selector
   * @returns The target element, or null if not found
   */
  protected _getTargetElement(selector: string): Element | null;

  /**
   * Creates and returns a Tour by loading a JSON file
   * @param filepath - The path to the JSON file
   * @remarks Returns `new this()` so needs an override per subclass.
   */
  static fromJSON(filepath: string): Promise<Tour.Any>;

  /**
   * Set-up operations performed before a step is shown.
   * @remarks Despite being marked `@abstract`, the base implementation is a no-op and doesn't throw.
   * Implementation is therefor *not* required by subclasses, but most probably will do so anyway
   */
  protected _preStep(): Promise<void>;

  /**
   * Clean-up operations performed after a step is completed.
   * @remarks Despite being marked `@abstract`, the base implementation is a method with a real body
   * and doesn't throw. Implementation is therefor *not* required by subclasses; none of core's  do,
   * and any that do must call `super._postStep()` in them
   */
  protected _postStep(): Promise<void>;

  /**
   * Renders the current Step of the Tour
   */
  protected _renderStep(): Promise<void>;

  /** @deprecated Made hard private in v13. This warning will be removed in v14. */
  protected _onButtonClick(event: never, buttons: never): never;

  /** @deprecated Made hard private in v13. This warning will be removed in v14. */
  protected _saveProgress(): never;

  /** @deprecated Made hard private in v13. This warning will be removed in v14. */
  protected _loadProgress(): never;

  /**
   * Reloads the Tour's current step from the saved progress
   * @internal
   */
  _reloadProgress(): void;

  #Tour: true;
}

declare namespace Tour {
  interface Any extends AnyTour {}
  interface AnyConstructor extends Identity<typeof AnyTour> {}

  /** @internal */
  type _Config = InexactPartial<{
    /** A human-readable description of this Tour. Localized. */
    description: string;

    /** A map of localizations for the Tour that should be merged into the default localizations */
    localization: Localization.Translations;

    /** Whether the Tour is restricted to the GM only. Defaults to false. */
    restricted: boolean;

    /** Whether the Tour should be displayed in the Manage Tours UI. Defaults to false. */
    display: boolean;

    /** Whether the Tour can be resumed or if it always needs to start from the beginning. Defaults to false. */
    canBeResumed: boolean;

    /**
     * A list of namespaced Tours that might be suggested to the user when this Tour is completed. The first non-completed Tour in the array will be recommended.
     * @remarks e.g. `["core.welcome"]`
     */
    suggestedNextTours: string[];
  }>;

  /** Tour configuration data */
  interface Config extends _Config {
    /**
     * The namespace this Tour belongs to. Typically, the name of the package which implements the tour should be used
     * @remarks Technically not required as long as the Tour is only constructed to be immediately passed
     * {@linkcode foundry.nue.ToursCollection.register | ToursCollection#register}, which will use its argument instead.
     * Core relies on this for all their tour definitions in `public/tours/*.json`, but it's safer and simpler from the
     * types perspective to leave it required, as per their typedef
     */
    namespace: string;

    /**
     * A machine-friendly id of the Tour, must be unique within the provided namespace
     * @remarks Technically not required as long as the Tour is only constructed to be immediately passed
     * {@linkcode foundry.nue.ToursCollection.register | ToursCollection#register}, which will use its argument instead.
     * Core relies on this for all their tour definitions in `public/tours/*.json`, but it's safer and simpler from the
     * types perspective to leave it required, as per their typedef
     */
    id: string;

    /**
     * A human-readable name for this Tour. Localized.
     * @remarks As in, "this gets localized", not "must be passed pre-localized"
     */
    title: string;

    /** The list of Tour Steps */
    steps: Tour.Step[];
  }

  /** @internal */
  type _Step = InexactPartial<{
    /** A DOM selector which denotes an element to highlight during this step. If omitted, the step is displayed in the center of the screen. */
    selector: string;

    /** How the tooltip for the step should be displayed relative to the target element. If omitted, the best direction will be attempted to be auto-selected. */
    tooltipDirection: TooltipManager.TOOLTIP_DIRECTIONS;

    /** Whether the Step is restricted to the GM only. Defaults to false. */
    restricted: boolean;
  }>;

  /** A step in a Tour */
  interface Step extends _Step {
    /** A machine-friendly id of the Tour Step */
    id: string;

    /** The title of the step, displayed in the tooltip header */
    title: string;

    /** Raw HTML content displayed during the step */
    content: string;
  }

  type STATUS = ValueOf<Status>;

  /** @internal */
  type _ConstructorOptions = InexactPartial<{
    /** A tour ID that supersedes `TourConfig#id` */
    id: string;

    /** A tour namespace that supersedes `TourConfig#namespace` */
    namespace: string;
  }>;

  interface ConstructorOptions extends _ConstructorOptions {}

  interface Status {
    readonly UNSTARTED: "unstarted";
    readonly IN_PROGRESS: "in-progress";
    readonly COMPLETED: "completed";
  }
}

export default Tour;

declare abstract class AnyTour extends Tour {
  constructor(...args: never);
}
