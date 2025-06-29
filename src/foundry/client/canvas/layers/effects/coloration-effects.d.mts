import type { HandleEmptyObject, Identity } from "#utils";
import type { VisualEffectsMaskingFilter } from "#client/canvas/rendering/filters/_module.mjs";
import type { CanvasLayer } from "../_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface CanvasLayerConfig {
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

  protected override _draw(options: HandleEmptyObject<CanvasColorationEffects.DrawOptions>): Promise<void>;

  protected override _tearDown(options: HandleEmptyObject<CanvasColorationEffects.TearDownOptions>): Promise<void>;
}

declare namespace CanvasColorationEffects {
  interface Any extends AnyCanvasColorationEffects {}
  interface AnyConstructor extends Identity<typeof AnyCanvasColorationEffects> {}

  interface DrawOptions extends CanvasLayer.DrawOptions {}

  interface TearDownOptions extends CanvasLayer.TearDownOptions {}
}

export default CanvasColorationEffects;

declare abstract class AnyCanvasColorationEffects extends CanvasColorationEffects {
  constructor(...args: never);
}
