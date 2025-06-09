import type { Canvas } from "#client/canvas/_module.d.mts";

declare global {
  /**
   * A type of ping that points to a specific location.
   */
  class ChevronPing extends Ping {
    /**
     * @param origin  - The canvas coordinates of the origin of the ping.
     * @param options - Additional options to configure the ping animation.
     *                  (default: `{duration: 900, size: 128, color: "#ff6400"}`)
     */
    constructor(
      origin: Canvas.Point,

      /** @privateRemarks Can't be `null` as it's directly assigned to  `Ping#options` which has properties accessed null-unsafely */
      options?: Ping.ConstructorOptions,
    );

    /** @defaultValue `(this.options.size / 2) * .75` */
    _r: number;

    /**
     * The inner ring is 3/4s the size of the outer.
     * @defaultValue `this._r * .75`
     */
    _rInner: number;

    /**
     * The animation is split into three stages. First, the chevron fades in and moves downwards, then the rings fade
     * in, then everything fades out as the chevron moves back up.
     * Store the 1/4 time slice.
     * @defaultValue `this.options.duration * .25`
     */
    _t14: number;

    /**
     * Store the 1/2 time slice.
     * @defaultValue `this.options.duration * .5`
     */
    _t12: number;

    /**
     * Store the 3/4s time slice.
     * @defaultValue `this._t14 * 3`
     */
    _t34: number;

    /** @remarks Doesn't exist before the first `#_createRings()` call, usually via `#animate()` */
    _inner?: PIXI.Graphics;

    /** @remarks Doesn't exist before the first `#_createRings()` call, usually via `#animate()` */
    _outer?: PIXI.Graphics;

    /**
     * The path to the chevron texture.
     * @remarks Unusually for Foundry, this is referred to by `ChevronPing.`, not `this.constructor.`, in
     * `#_loadChevron()`, which must therefore be overridden to use a different value in a subclass
     * @privateRemarks Foundry marked `@private`.
     */
    static _CHEVRON_PATH: string;

    override animate(): Promise<boolean>;

    override _animateFrame(dt: number, animation: CanvasAnimation.AnimationData): void;

    /**
     * Draw the outer and inner rings.
     * @param a - The alpha.
     * @privateRemarks Foundry marked `@private`
     */
    _drawRings(a: number): void;

    /**
     * Load the chevron texture.
     * @privateRemarks Foundry marked `@private`
     */
    _loadChevron(): Promise<PIXI.Sprite>;

    /**
     * Draw the two rings that are used as part of the ping animation.
     * @privateRemarks Foundry marked `@private`
     */
    _createRings(): [PIXI.Graphics, PIXI.Graphics];
  }
}
