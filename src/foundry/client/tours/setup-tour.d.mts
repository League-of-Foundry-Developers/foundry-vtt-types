import type { Tour } from "../core/tour.d.mts";

declare global {
  class SetupTour extends Tour {
    constructor(
      config: SetupTour.Config,
      { id, namespace }?: { id?: SetupTour.Config["id"]; namespace?: SetupTour.Config["namespace"] },
    );
    config: SetupTour.Config;

    focusedApp: foundry.appv1.api.Application.Any | foundry.applications.api.ApplicationV2.Any;
    override get canStart(): boolean;
    override get steps(): Tour.Step[];
    protected override _preStep(): Promise<void>;
    private _installingASystem(): Promise<void>;
    private _creatingAWorld(): Promise<void>;
  }

  namespace SetupTour {
    interface Config extends Tour.Config {
      /**
       * Whether to close all open windows before beginning the tour.
       * @defaultValue `true`
       */
      closeWindows: boolean;
    }
  }
}
