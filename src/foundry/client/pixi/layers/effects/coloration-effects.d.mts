export {};

declare global {
  /**
   * A CanvasLayer for displaying coloration visual effects
   */
  class CanvasColorationEffects<
    DrawOptions extends CanvasColorationEffects.DrawOptions = CanvasColorationEffects.DrawOptions,
    TearDownOptions extends CanvasColorationEffects.TearDownOptions = CanvasColorationEffects.TearDownOptions,
  > extends CanvasLayer<DrawOptions, TearDownOptions> {
    /**
     * @defaultValue `true`
     */
    override sortableChildren: boolean;

    /**
     * The filter used to mask visual effects on this layer
     */
    filter: VisualEffectsMaskingFilter;

    /**
     * Clear coloration effects container
     */
    clear(): void;

    protected override _draw(options?: DrawOptions): Promise<void>;

    protected override _tearDown(options?: TearDownOptions): Promise<void>;
  }

  namespace CanvasColorationEffects {
    type AnyConstructor = typeof AnyCanvasColorationEffects;

    interface DrawOptions extends CanvasLayer.DrawOptions {}

    interface TearDownOptions extends CanvasLayer.TearDownOptions {}
  }
}

declare abstract class AnyCanvasColorationEffects extends CanvasColorationEffects {
  constructor(arg0: never, ...args: never[]);
}
