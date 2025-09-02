import type { Identity, InexactPartial } from "#utils";
import type Tour from "../tour.mjs";

/**
 * A Tour subclass for the Sidebar Tour
 */
declare class SidebarTour extends Tour {
  /** @privateRemarks Fake type override */
  constructor(config: SidebarTour.Config, options?: Tour.ConstructorOptions);

  /** @privateRemarks Fake type override */
  override config: SidebarTour.Config;

  override start(): Promise<void>;

  /** @privateRemarks Fake type override */
  static override fromJSON(filepath: string): Promise<SidebarTour.Any>;

  protected override _preStep(): Promise<void>;
}

declare namespace SidebarTour {
  interface Any extends AnySidebarTour {}
  interface AnyConstructor extends Identity<typeof AnySidebarTour> {}

  /** @internal */
  type _Step = InexactPartial<{
    /**
     * Activates a particular sidebar tab. Usable in {@linkcode SidebarTour} instances.
     * @remarks {@linkcode SidebarTour._preStep | SidebarTour#_preStep} does `await ui[this.currentStep.sidebarTab]?.activate();`
     */
    sidebarTab: keyof typeof ui;
  }>;

  interface Step extends Tour.Step, _Step {}

  interface Config extends Tour.Config {
    steps: SidebarTour.Step[];
  }
}

export default SidebarTour;

declare abstract class AnySidebarTour extends SidebarTour {
  constructor(...args: never);
}
