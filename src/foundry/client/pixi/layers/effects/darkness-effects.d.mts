import type { HandleEmptyObject, Identity } from "#utils";

declare module "#configuration" {
  namespace Hooks {
    interface CanvasLayerConfig {
      CanvasDarknessEffects: CanvasDarknessEffects.Any;
    }
  }
}

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
    interface Any extends AnyCanvasDarknessEffects {}
    interface AnyConstructor extends Identity<typeof AnyCanvasDarknessEffects> {}

    interface DrawOptions extends CanvasLayer.DrawOptions {}

    interface TearDownOptions extends CanvasLayer.TearDownOptions {}
  }
}

declare abstract class AnyCanvasDarknessEffects extends CanvasDarknessEffects {
  constructor(...args: never);
}
