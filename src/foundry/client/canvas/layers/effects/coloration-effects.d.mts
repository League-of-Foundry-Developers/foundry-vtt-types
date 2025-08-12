import type { AnyObject, Identity } from "#utils";
import type { VisualEffectsMaskingFilter } from "#client/canvas/rendering/filters/_module.mjs";
import type { CanvasLayer } from "../_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface CanvasLayerConfig {
      /** @remarks Not configurable, doesn't have an `Implementation` */
      CanvasColorationEffects: CanvasColorationEffects.Any;
    }
  }
}

/**
 * A CanvasLayer for displaying coloration visual effects
 */
declare class CanvasColorationEffects extends CanvasLayer {
  /**
   * @defaultValue `true`
   */
  override sortableChildren: boolean;

  /**
   * The filter used to mask visual effects on this layer
   * @remarks Only `undefined` prior to first draw
   */
  filter: VisualEffectsMaskingFilter.Implementation | undefined;

  /**
   * Clear coloration effects container
   */
  clear(): void;

  protected override _draw(options: AnyObject): Promise<void>;

  protected override _tearDown(options: AnyObject): Promise<void>;

  #ColorationEffects: true;
}

declare namespace CanvasColorationEffects {
  interface Any extends AnyCanvasColorationEffects {}
  interface AnyConstructor extends Identity<typeof AnyCanvasColorationEffects> {}
}

export default CanvasColorationEffects;

declare abstract class AnyCanvasColorationEffects extends CanvasColorationEffects {
  constructor(...args: never);
}
