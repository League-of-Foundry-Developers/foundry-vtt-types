import type { HandleEmptyObject, Identity } from "#utils";
import type { CanvasLayer } from "../_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface CanvasLayerConfig {
      CanvasDarknessEffects: CanvasDarknessEffects.Any;
    }
  }
}

/**
 * A layer of background alteration effects which change the appearance of the primary group render texture.
 */
declare class CanvasDarknessEffects extends CanvasLayer {
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

declare namespace CanvasDarknessEffects {
  interface Any extends AnyCanvasDarknessEffects {}
  interface AnyConstructor extends Identity<typeof AnyCanvasDarknessEffects> {}

  interface DrawOptions extends CanvasLayer.DrawOptions {}

  interface TearDownOptions extends CanvasLayer.TearDownOptions {}
}

export default CanvasDarknessEffects;

declare abstract class AnyCanvasDarknessEffects extends CanvasDarknessEffects {
  constructor(...args: never);
}
