export {};

declare global {
  namespace Tour {
    /** A step in a Tour */
    interface Step {
      /** A machine-friendly id of the Tour Step */
      id: string;
      /** A DOM selector which denotes an element to highlight during this step */
      selector: string;
      /** The title of the step, displayed in the tooltip header */
      title: string;
      /** Raw HTML content displayed during the step */
      content: string;
      /** How the tooltip for the step should be */
      tooltipDirection: string;
    }

    /** Tour configuration data */
    interface Config {
      /** The namespace this Tour belongs to. Typically, the name of the package which implements the tour should be used */
      namespace: string;
      /** A machine-friendly id of the Tour, must be unique within the provided namespace */
      id: string;
      /** A human-readable name for this Tour */
      title: string;
      /** A human-readable description of this Tour */
      description: string;
      /** The list of Tour Steps */
      steps: Tour.Step[];
      /** A map of translations for the Tour that should be merged into the default translations */
      translations: object;
      /** Whether the Tour is restricted to the GM only */
      restricted: boolean;
      /** Whether the Tour should be displayed in the Manage Tours UI */
      display: boolean;
      /** Whether the Tour can be resumed or if it always needs to start from the beginning */
      canBeResumed: boolean;
    }
    type STATUS = ValueOf<typeof Tour.STATUS>;
  }

  /**
   * A Tour that shows a series of guided steps.
   */
  class Tour {
    /**
     * @param config - The configuration of the Tour
     */
    constructor(
      config: Tour.Config,
      { id, namespace }?: { id?: Tour.Config['id']; namespace?: Tour.Config['namespace'] }
    );
    /**
     * The configuration of the tour. Cloned to avoid mutating the original configuration.
     */
    config: Tour.Config;

    static STATUS: Readonly<{
      UNSTARTED: 'unstarted';
      IN_PROGRESS: 'in-progress';
      COMPLETED: 'completed';
    }>;

    /**
     * The HTMLElement which is the focus of the current tour step.
     */
    targetElement: HTMLElement | undefined;

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
     * The identifier of the tour.
     */
    get id(): string;

    /**
     * The identifier of the tour.
     */
    set id(value: string);

    /**
     * The human-readable title for the tour.
     */
    get title(): string;

    /**
     * The human-readable description of the tour.
     */
    get description(): string;

    /**
     * The package namespace for the tour.
     */
    get namespace(): string;

    /**
     * The package namespace for the tour.
     */
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
     * Start the Tour at its current step, or at the beginning if the tour has not yet been started.
     */
    start(): Promise<void>;

    /**
     * Progress the Tour to the next step.
     */
    next(): Promise<void>;

    /**
     * Rewind the Tour to the previous step.
     */
    previous(): Promise<void>;

    /**
     * Progresses to a given Step
     * @param stepIndex - The step to progress to
     */
    progress(stepIndex: number): Promise<void>;

    /**
     * Creates and returns a Tour by loading a JSON file
     * @param filepath - The path to the JSON file
     */
    static fromJSON(filepath: string): Promise<Tour>;

    /**
     * Set-up operations performed before a step is shown.
     * @virtual
     */
    protected _preStep(): Promise<void>;

    /**
     * Clean-up operations performed after a step is completed.
     * @virtual
     */
    protected _postStep(): Promise<void>;

    /**
     * Renders the current Step of the Tour
     */
    protected _renderStep(): Promise<void>;

    /**
     * Handle Tour Button clicks
     * @param event - A click event
     * @internal
     */
    protected _onButtonClick(event: MouseEvent): Promise<void>;

    /**
     * Saves the current progress of the Tour to a world setting
     * @internal
     */
    protected _saveProgress(): void;

    /**
     * Returns the User's current progress of this Tour
     * @internal
     */
    protected _loadProgress(): null | number;

    /**
     * Reloads the Tour's current step from the saved progress
     * @internal
     */
    _reloadProgress(): void;
  }
}
