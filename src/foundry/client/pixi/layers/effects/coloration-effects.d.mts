import type { HandleEmptyObject, Identity } from "fvtt-types/utils";

declare global {
  /**
   * A CanvasLayer for displaying coloration visual effects
   */
  class CanvasColorationEffects extends CanvasLayer {
    /**
     * @defaultValue `true`
     */
    override sortableChildren: boolean;

    /**
     * The filter used to mask visual effects on this layer
     * @remarks Only `undefined` prior to first draw
     */
    filter: VisualEffectsMaskingFilter.ConfiguredInstance | undefined;

    /**
     * Clear coloration effects container
     */
    clear(): void;

    protected override _draw(options: HandleEmptyObject<CanvasColorationEffects.DrawOptions>): Promise<void>;

    protected override _tearDown(options: HandleEmptyObject<CanvasColorationEffects.TearDownOptions>): Promise<void>;
  }

  namespace CanvasColorationEffects {
    interface Any extends AnyCanvasColorationEffects {}
    interface AnyConstructor extends Identity<typeof AnyCanvasColorationEffects> {}

    interface DrawOptions extends CanvasLayer.DrawOptions {}

    interface TearDownOptions extends CanvasLayer.TearDownOptions {}
  }
}

declare abstract class AnyCanvasColorationEffects extends CanvasColorationEffects {
  constructor(...args: never);
}
