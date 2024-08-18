import type { Tour } from "../core/tour.d.mts";

declare global {
  class SetupTour extends Tour {
    constructor(
      config: SetupTourConfig,
      { id, namespace }?: { id?: SetupTourConfig["id"]; namespace?: SetupTourConfig["namespace"] },
    );
    config: SetupTourConfig;

    focusedApp: Application.Any;
    override get canStart(): boolean;
    override get steps(): TourStep[];
    protected override _preStep(): Promise<void>;
    private _installingASystem(): Promise<void>;
    private _creatingAWorld(): Promise<void>;
  }

  interface SetupTourConfig extends TourConfig {
    /**
     * Whether to close all open windows before beginning the tour.
     * @defaultValue `true`
     */
    closeWindows: boolean;
  }
}
