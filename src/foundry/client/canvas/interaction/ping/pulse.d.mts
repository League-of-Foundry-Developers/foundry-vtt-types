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
  constructor(
    origin: Canvas.Point,

    /** @privateRemarks Can't be `null` as it's directly assigned to  `Ping#options` which has properties accessed null-unsafely */
    options?: PulsePing.ConstructorOptions,
  );

  override options: PulsePing.ConstructorOptions;

  _color2: Color;

  /**
   * The radius is half the diameter.
   * @defaultValue `this.options.size / 2`
   */
  _r: number;

  /**
   * This is the radius that the rings initially begin at. It's set to 1/5th of the maximum radius.
   * @defaultValue `this._r / 5`
   */
  _r0: number;

  /**
   * Initialize some time slice variables that will be used to control the animation.
   *
   * The animation for each ring can be separated into two consecutive stages.
   * Stage 1: Fade in a white ring with radius r0.
   * Stage 2: Expand radius outward. While the radius is expanding outward, we have two additional, consecutive
   * animations:
   *  Stage 2.1: Transition color from white to the configured color.
   *  Stage 2.2: Fade out.
   * 1/5th of the animation time is allocated to Stage 1. 4/5ths are allocated to Stage 2. Of those 4/5ths, 2/5ths
   * are allocated to Stage 2.1, and 2/5ths are allocated to Stage 2.2.
   */
  protected _computeTimeSlices(): void;

  override animate(): Promise<boolean>;

  override _animateFrame(dt: number, animation: CanvasAnimation.AnimationData<this>): void;

  /**
   * Transition linearly from one color to another.
   * @param from     - The color to transition from.
   * @param to       - The color to transition to.
   * @param duration - The length of the transition in milliseconds.
   * @param t        - The current time along the duration.
   * @returns The incremental color between from and to.
   * @privateRemarks Foundry marked `@private`, and only types the return as `number`, instead of the more accurate `Color`
   */
  protected _colorTransition(from: Color, to: Color, duration: number, t: number): Color;

  /**
   * Draw the shape for this ping.
   * @param g     - The graphics object to draw to.
   * @param color - The color of the shape.
   * @param alpha - The alpha of the shape.
   * @param size  - The size of the shape to draw.
   */
  protected _drawShape(g: PIXI.Graphics, color: number | Color, alpha: number, size: number): void;
}

declare namespace PulsePing {
  interface Any extends AnyPulsePing {}
  interface AnyConstructor extends Identity<typeof AnyPulsePing> {}

  /** @internal */
  type _ConstructorOptions = InexactPartial<{
    /**
     * The number of rings used in the animation.
     * @defaultValue `3`
     * @remarks Can't be `null` as it only has a parameter default and a coerced `0` ring count is nonsensical
     */
    rings: number;

    /**
     * The alternate color that the rings begin at. Use white for a 'flashing' effect.
     * @defaultValue `#ffffff`
     * @remarks Can't be `null` as it only has a parameter default and `Color(NaN)`s are to be avoided
     */
    color2: Color.Source;
  }>;

  interface ConstructorOptions extends _ConstructorOptions, Ping.ConstructorOptions {}
}

export default PulsePing;

declare abstract class AnyPulsePing extends PulsePing {
  constructor(...args: never);
}
