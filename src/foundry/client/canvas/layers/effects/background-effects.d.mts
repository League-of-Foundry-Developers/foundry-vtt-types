import type { HandleEmptyObject, Identity } from "#utils";
import type { CanvasLayer } from "../_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface CanvasLayerConfig {
      /** @remarks Not configurable, doesn't have an `Implementation` */
      CanvasBackgroundAlterationEffects: CanvasBackgroundAlterationEffects.Any;
    }
  }
}

/**
 * A layer of background alteration effects which change the appearance of the primary group render texture.
 */
declare class CanvasBackgroundAlterationEffects extends CanvasLayer {
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

  // fake type override
  override draw(options?: HandleEmptyObject<CanvasBackgroundAlterationEffects.DrawOptions>): Promise<this>;

  protected override _draw(options: HandleEmptyObject<CanvasBackgroundAlterationEffects.DrawOptions>): Promise<void>;

  // fake type override
  override tearDown(options?: CanvasBackgroundAlterationEffects.TearDownOptions): Promise<this>;

  protected override _tearDown(options: CanvasBackgroundAlterationEffects.TearDownOptions): Promise<void>;

  /**
   * Clear background alteration effects vision and lighting containers
   */
  clear(): void;
}

declare namespace CanvasBackgroundAlterationEffects {
  interface Any extends AnyCanvasBackgroundAlterationEffects {}
  interface AnyConstructor extends Identity<typeof AnyCanvasBackgroundAlterationEffects> {}

  interface DrawOptions extends CanvasLayer.DrawOptions {}

  interface TearDownOptions extends CanvasLayer.TearDownOptions {}
}

export default CanvasBackgroundAlterationEffects;

declare abstract class AnyCanvasBackgroundAlterationEffects extends CanvasBackgroundAlterationEffects {
  constructor(...args: never);
}
