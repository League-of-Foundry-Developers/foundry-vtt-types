export {};

declare global {
  interface PulsePingOptions extends PingOptions {
    /**
     * The number of rings used in the animation.
     * (default: `3`)
     */
    rings?: number;

    /**
     * The alternate color that the rings begin at. Use white for a 'flashing' effect.
     * (default: `#ffffff`)
     */
    color2?: string;
  }

  /**
   * A type of ping that produces a pulsing animation.
   */
  class PulsePing extends Ping {
    /**
     * @param origin - The canvas coordinates of the origin of the ping.
     * @param options - Additional options to configure the ping animation.
     */
    constructor(origin: Point, options?: PulsePingOptions);

    _color2: Color | number;

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

    override _animateFrame(dt: number, animation: CanvasAnimationData): void;

    /**
     * Transition linearly from one color to another.
     * @param from     - The color to transition from.
     * @param to       - The color to transition to.
     * @param duration - The length of the transition in milliseconds.
     * @param t        - The current time along the duration.
     * @returns The incremental color between from and to.
     * @internal
     */
    protected _colorTransition(from: Color, to: Color, duration: number, t: number): number;

    /**
     * Draw the shape for this ping.
     * @param g     - The graphics object to draw to.
     * @param color - The color of the shape.
     * @param alpha - The alpha of the shape.
     * @param size  - The size of the shape to draw.
     */
    protected _drawShape(g: PIXI.Graphics, color: number, alph: number, size: number): void;
  }

  /**
   * A type of ping that produces an arrow pointing in a given direction.
   */
  class ArrowPing extends PulsePing {
    /**
     * @param origin - The canvas coordinates of the origin of the ping. This becomes the arrow's tip.
     * @param options - Additional options to configure the ping animation.
     */
    constructor(
      origin: PIXI.Point,
      options: PulsePingOptions & {
        /**
         * The angle of the arrow in radians.
         * (default: `0`)
         */
        rotation: number;
      },
    );

    protected override _drawShape(g: PIXI.Graphics, color: number, alph: number, size: number): void;
  }

  /**
   * A type of ping that produces a pulse warning sign animation.
   */
  class AlertPing extends PulsePing {
    /**
     * @param origin  - The canvas coordinates of the origin of the ping.
     * @param options - Additional options to configure the ping animation.
     */
    constructor(origin: PIXI.Point, options: PulsePingOptions);

    protected override _drawShape(g: PIXI.Graphics, color: number, alph: number, size: number): void;
  }
}
