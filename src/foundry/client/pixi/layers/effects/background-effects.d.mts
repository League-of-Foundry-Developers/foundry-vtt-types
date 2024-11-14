export {};

declare global {
  /**
   * A layer of background alteration effects which change the appearance of the primary group render texture.
   */
  class CanvasBackgroundAlterationEffects<
    DrawOptions extends CanvasBackgroundAlterationEffects.DrawOptions = CanvasBackgroundAlterationEffects.DrawOptions,
    TearDownOptions extends
      CanvasBackgroundAlterationEffects.TearDownOptions = CanvasBackgroundAlterationEffects.TearDownOptions,
  > extends CanvasLayer<DrawOptions, TearDownOptions> {
    /**
     * A collection of effects which provide background vision alterations.
     * @defaultValue `vision.sortableChildren = true`
     */
    vision: PIXI.Container;

    /**
     * A collection of effects which provide background preferred vision alterations.
     * @defaultValue `visionPreferred.sortableChildren = true`
     */
    visionPreferred: PIXI.Container;

    /**
     * A collection of effects which provide other background alterations.
     */
    lighting: PIXI.Container;

    protected override _draw(options?: DrawOptions): Promise<void>;

    protected override _tearDown(options?: TearDownOptions): Promise<void>;

    /**
     * Clear background alteration effects vision and lighting containers
     */
    clear(): void;
  }

  namespace CanvasBackgroundAlterationEffects {
    type AnyConstructor = typeof AnyCanvasBackgroundAlterationEffects;

    interface DrawOptions extends CanvasLayer.DrawOptions {}

    interface TearDownOptions extends CanvasLayer.DrawOptions {}
  }
}

declare abstract class AnyCanvasBackgroundAlterationEffects extends CanvasBackgroundAlterationEffects {
  constructor(arg0: never, ...args: never[]);
}
