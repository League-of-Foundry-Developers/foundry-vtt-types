import type { Identity, IntentionalPartial } from "#utils";
import type { Canvas } from "#client/canvas/_module.d.mts";
import type { CanvasAnimation } from "#client/canvas/animation/_module.d.mts";
import type { Ping } from "#client/canvas/interaction/_module.d.mts";

/**
 * A type of ping that produces a pulsing animation.
 */
declare class PulsePing extends Ping {
  /**
   * @param origin - The canvas coordinates of the origin of the ping.
   * @param options - Additional options to configure the ping animation.
   */
  constructor(origin: Canvas.Point, options?: PulsePing.ConstructorOptions);

  // fake type override
  override options: PulsePing.ConstructorOptions;

  override animate(): Promise<boolean>;

  protected override _animateFrame(dt: number, animation: CanvasAnimation.AnimationData<this>): void;

  /**
   * Draw the shape for this ping.
   * @param g     - The graphics object to draw to.
   * @param color - The color of the shape.
   * @param alpha - The alpha of the shape.
   * @param size  - The size of the shape to draw.
   */
  protected _drawShape(g: PIXI.Graphics, color: number, alpha: number, size: number): void;

  #PulsePing: true;
}

declare namespace PulsePing {
  interface Any extends AnyPulsePing {}
  interface AnyConstructor extends Identity<typeof AnyPulsePing> {}

  /** @internal */
  interface _ConstructorOptionsBase extends Ping._ConstructorOptionsBase {
    /**
     * The number of rings used in the animation.
     * @defaultValue `3`
     */
    rings: number | undefined;

    /**
     * The alternate color that the rings begin at. Use white for a 'flashing' effect.
     * @defaultValue `#ffffff`
     */
    color2: Color.Source | undefined;
  }

  /** @internal */
  interface _ConstructorOptions extends _ConstructorOptionsBase, Ping._ConstructorOptions {}

  /** @privateRemarks Some properties can't be `undefined`, so `IntentionalPartial`. */
  interface ConstructorOptions extends IntentionalPartial<_ConstructorOptions> {}
}

export default PulsePing;

declare abstract class AnyPulsePing extends PulsePing {
  constructor(...args: never);
}
