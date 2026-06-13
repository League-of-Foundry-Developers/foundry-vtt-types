import type { HandleEmptyObject, Identity } from "#utils";
import type { CanvasLayer } from "../_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface CanvasLayerConfig {
      /** @remarks Not configurable, doesn't have an `Implementation` */
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

  // fake type override
  override draw(options?: HandleEmptyObject<CanvasDarknessEffects.DrawOptions>): Promise<this>;

  protected override _draw(options: HandleEmptyObject<CanvasDarknessEffects.DrawOptions>): Promise<void>;
}

declare namespace CanvasDarknessEffects {
  interface Any extends AnyCanvasDarknessEffects {}
  interface AnyConstructor extends Identity<typeof AnyCanvasDarknessEffects> {}

  interface DrawOptions extends CanvasLayer.DrawOptions {}

  // `CanvasDarknessEffects` has no `_tearDown` override, this exists for consistency
  interface TearDownOptions extends CanvasLayer.TearDownOptions {}
}

export default CanvasDarknessEffects;

declare abstract class AnyCanvasDarknessEffects extends CanvasDarknessEffects {
  constructor(...args: never);
}
