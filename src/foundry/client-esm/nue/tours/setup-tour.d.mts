import type Tour from "../tour.mjs";

/**
 * A Tour subclass that handles controlling the UI state of the Setup screen
 */
declare class SetupTour extends Tour {
  constructor(config: SetupTour.Config, options?: Tour.ConstructorOptions);

  /**
   * Stores a currently open Application for future steps
   */
  focusedApp: Application;

  override get canStart(): boolean;
  override get steps(): Tour.Step[];
  protected override _preStep(): Promise<void>;

  #setupTour: true;
}

declare namespace SetupTour {
  interface Config extends Tour.Config {
    /**
     * Whether to close all open windows before beginning the tour.
     * @defaultValue `true`
     */
    closeWindows: boolean;
  }
}

export default SetupTour;
