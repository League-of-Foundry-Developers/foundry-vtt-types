import type { Identity, InexactPartial } from "#utils";
import type { Tour } from "#client/nue/_module.d.mts";
import type { SceneControls } from "#client/applications/ui/_module.d.mts";

/**
 * A tour for demonstrating an aspect of Canvas functionality.
 * Automatically activates a certain canvas layer or tool depending on the needs of the step.
 */
declare class CanvasTour extends Tour {
  /** @privateRemarks Fake type override */
  constructor(config: CanvasTour.Config, options?: Tour.ConstructorOptions);

  /** @privateRemarks Fake type override */
  override config: CanvasTour.Config;

  override start(): Promise<void>;

  override get canStart(): boolean;

  /** @privateRemarks Fake type override */
  static override fromJSON(filepath: string): Promise<CanvasTour.Any>;

  protected override _preStep(): Promise<void>;

  #CanvasTour: true;
}

declare namespace CanvasTour {
  interface Any extends AnyCanvasTour {}
  interface AnyConstructor extends Identity<typeof AnyCanvasTour> {}

  interface Config extends Tour.Config {
    steps: CanvasTour.Step[];
  }

  /** @internal */
  type _Step = InexactPartial<{
    /**
     * Activates a particular canvas layer and its respective control group. Usable in `CanvasTour` instances
     * @privateRemarks This is just `string` for now, but we may narrow the controls type to only configured values in future
     */
    layer: keyof SceneControls["controls"];

    /** Activates a particular tool. Usable in `CanvasTour` instances. */
    tool: string;
  }>;

  interface Step extends Tour.Step, _Step {}
}

export default CanvasTour;

declare abstract class AnyCanvasTour extends CanvasTour {
  constructor(...args: never);
}
