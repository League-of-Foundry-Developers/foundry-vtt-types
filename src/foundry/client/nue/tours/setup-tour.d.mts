import type { Identity, InexactPartial } from "#utils";
import type { Tour } from "#client/nue/_module.d.mts";
import type { Application } from "#client/appv1/api/_module.d.mts";
import type { ApplicationV2 } from "#client/applications/api/_module.d.mts";

/**
 * A Tour subclass that handles controlling the UI state of the Setup screen
 */
declare class SetupTour extends Tour {
  /** @privateRemarks Fake type override */
  constructor(config: SetupTour.Config, options?: Tour.ConstructorOptions);

  /** @privateRemarks Fake type override */
  config: SetupTour.Config;

  /**
   * Stores a currently open Application for future steps
   */
  focusedApp: Application.Any | ApplicationV2.Any;

  override get canStart(): boolean;

  /** @remarks Removes the GM check, as 'A user is always "GM" for Setup Tours' */
  override get steps(): Tour.Step[];

  /** @privateRemarks Fake type override */
  static override fromJSON(filepath: string): Promise<SetupTour.Any>;

  protected override _preStep(): Promise<void>;

  #SetupTour: true;
}

declare namespace SetupTour {
  interface Any extends AnySetupTour {}
  interface AnyConstructor extends Identity<typeof AnySetupTour> {}

  /** @internal */
  type _Config = InexactPartial<{
    /**
     * Whether to close all open windows before beginning the tour.
     * @remarks Checked for `!== false`, so effectively defaults `true`
     */
    closeWindows: boolean;
  }>;

  interface Config extends Tour.Config, _Config {}
}

export default SetupTour;

declare abstract class AnySetupTour extends SetupTour {
  constructor(...args: never);
}
