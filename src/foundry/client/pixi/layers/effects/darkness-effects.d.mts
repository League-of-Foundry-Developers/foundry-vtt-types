export {};

declare global {
  /**
   * A layer of background alteration effects which change the appearance of the primary group render texture.
   */
  class CanvasDarknessEffects<
    DrawOptions extends CanvasDarknessEffects.DrawOptions = CanvasDarknessEffects.DrawOptions,
    TearDownOptions extends CanvasLayer.TearDownOptions = CanvasLayer.TearDownOptions,
  > extends CanvasLayer<DrawOptions, TearDownOptions> {
    /**
     * @defaultValue `true`
     */
    override sortableChildren: boolean;

    /**
     * Clear coloration effects container
     */
    clear(): void;

    override _draw(options: DrawOptions): Promise<void>;
  }

  namespace CanvasDarknessEffects {
    type AnyConstructor = typeof AnyCanvasDarknessEffects;

    interface DrawOptions extends CanvasLayer.DrawOptions {}
  }
}

declare abstract class AnyCanvasDarknessEffects extends CanvasDarknessEffects {
  constructor(arg0: never, ...args: never[]);
}
