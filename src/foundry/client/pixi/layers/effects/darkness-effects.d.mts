import type { HandleEmptyObject } from "fvtt-types/utils";

declare global {
  /**
   * A layer of background alteration effects which change the appearance of the primary group render texture.
   */
  class CanvasDarknessEffects extends CanvasLayer {
    /**
     * @defaultValue `true`
     */
    override sortableChildren: boolean;

    /**
     * Clear coloration effects container
     */
    clear(): void;

    protected override _draw(options: HandleEmptyObject<CanvasDarknessEffects.DrawOptions>): Promise<void>;
  }

  namespace CanvasDarknessEffects {
    type AnyConstructor = typeof AnyCanvasDarknessEffects;

    interface DrawOptions extends CanvasLayer.DrawOptions {}
  }
}

declare abstract class AnyCanvasDarknessEffects extends CanvasDarknessEffects {
  constructor(arg0: never, ...args: never[]);
}
