import type { Identity, IntentionalPartial, RemoveIndexSignatures } from "#utils";

declare global {
  /**
   * A class to manage a user ping on the canvas.
   */
  class Ping extends PIXI.Container {
    /**
     * @param origin  - The canvas coordinates of the origin of the ping.
     * @param options - Additional options to configure the ping animation.
     */
    constructor(origin: Canvas.Point, options?: Ping.ConstructorOptions);

    options: Ping.ConstructorOptions;

    _color: Color;

    /** @remarks `Ping#destroy`'s parameter must be an object if passed, as the body does `options.children = true` */
    override destroy(options?: PIXI.IDestroyOptions): void;

    /**
     * Start the ping animation.
     * @returns Returns true if the animation ran to completion, false otherwise.
     * @privateRemarks This calls `CanvasAnimation.animate` with an empty attribute array for the first argument,
     * meaning no chance of early return, so no `| void` in the return type
     */
    animate(): Promise<boolean>;

    /**
     * On each tick, advance the animation.
     * @param dt        - The number of ms that elapsed since the previous frame.
     * @param animation - The animation state.
     */
    protected _animateFrame(dt: number, animation: CanvasAnimation.AnimationData): void;
  }

  namespace Ping {
    interface Any extends AnyPing {}
    interface AnyConstructor extends Identity<typeof AnyPing> {}

    type ConfiguredStyles = keyof RemoveIndexSignatures<typeof CONFIG.Canvas.pings.styles>;

    /** @internal */
    type _ConstructorOptions = IntentionalPartial<{
      /**
       * The duration of the animation in milliseconds.
       * @defaultValue `900`
       * @remarks Can't be `null` because `options` is `mergeObject`ed with an object with this key,
       * and the result is passed on to `CanvasAnimation.animate` in its options, which only has a
       * parameter default for this property
       */
      duration: number | undefined;

      /**
       * The size of the ping graphic.
       * @defaultValue `128`
       * @remarks Can't be `null` or `undefined` because `options` is `mergeObject`ed with an object with this key.
       * This value is not used in the base `Ping` class, but is used by subclasses to define radius and padding in
       * ways where `undefined` produces `NaN` and values of `0` (ie, cast `null`) are nonsensical
       */
      size: number;

      /**
       * The color of the ping graphic.
       * @defaultValue `#ff6400`
       * @remarks Can't be `null` or `undefined` because `options` is `mergeObject`ed with an object with this key,
       * and passing either to `Color.from` produces a `Color(NaN)`, which may cause breakage in subclasses or when
       * passed to PIXI methods
       */
      color: Color.Source;

      /**
       * The name for the ping animation to pass to {@linkcode CanvasAnimation.animate}.
       */
      name: PropertyKey | undefined | null;
    }>;

    interface ConstructorOptions extends Ping._ConstructorOptions {}
  }

  /**
   * @deprecated Replaced with {@linkcode Ping.ConstructorOptions}
   */
  type PingOptions = Ping.ConstructorOptions;
}

declare abstract class AnyPing extends Ping {
  constructor(...args: never);
}
