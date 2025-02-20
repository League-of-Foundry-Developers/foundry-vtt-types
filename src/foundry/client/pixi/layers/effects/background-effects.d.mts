import type { HandleEmptyObject } from "fvtt-types/utils";

declare global {
  /**
   * A layer of background alteration effects which change the appearance of the primary group render texture.
   */
  class CanvasBackgroundAlterationEffects extends CanvasLayer {
    /**
     * A collection of effects which provide background vision alterations.
     */
    vision: PIXI.Container;

    /**
     * A collection of effects which provide background preferred vision alterations.
     */
    visionPreferred: PIXI.Container;

    /**
     * A collection of effects which provide other background alterations.
     */
    lighting: PIXI.Container;

    protected override _draw(options: HandleEmptyObject<CanvasBackgroundAlterationEffects.DrawOptions>): Promise<void>;

    protected override _tearDown(
      options: HandleEmptyObject<CanvasBackgroundAlterationEffects.TearDownOptions>,
    ): Promise<void>;

    /**
     * Clear background alteration effects vision and lighting containers
     */
    clear(): void;
  }

  namespace CanvasBackgroundAlterationEffects {
    interface Any extends AnyCanvasBackgroundAlterationEffects {}
    type AnyConstructor = typeof AnyCanvasBackgroundAlterationEffects;

    interface DrawOptions extends CanvasLayer.DrawOptions {}

    interface TearDownOptions extends CanvasLayer.DrawOptions {}
  }
}

declare abstract class AnyCanvasBackgroundAlterationEffects extends CanvasBackgroundAlterationEffects {
  constructor(arg0: never, ...args: never[]);
}
