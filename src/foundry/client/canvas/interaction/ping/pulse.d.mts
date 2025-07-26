import type { Identity, InexactPartial } from "#utils";
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

  override options: PulsePing.ConstructorOptions;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  _color2: never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  _r: never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  _r0: never;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected _computeTimeSlices(): never;

  override animate(): Promise<boolean>;

  protected override _animateFrame(dt: number, animation: CanvasAnimation.AnimationData<this>): void;

  /** @deprecated Made hard private in v13 (this warning will be removed in v14) */
  protected _colorTransition(from: never, to: never, duration: never, t: never): never;

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
  type _ConstructorOptions = InexactPartial<{
    /**
     * The number of rings used in the animation.
     * @defaultValue `3`
     */
    rings: number;

    /**
     * The alternate color that the rings begin at. Use white for a 'flashing' effect.
     * @defaultValue `#ffffff`
     */
    color2: Color.Source;
  }>;

  interface ConstructorOptions extends _ConstructorOptions, Ping.ConstructorOptions {}
}

export default PulsePing;

declare abstract class AnyPulsePing extends PulsePing {
  constructor(...args: never);
}
