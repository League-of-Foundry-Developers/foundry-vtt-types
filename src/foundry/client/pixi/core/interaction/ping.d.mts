import type { IntentionalPartial } from "../../../../../utils/index.d.mts";

declare global {
  /**
   * A class to manage a user ping on the canvas.
   */
  class Ping extends PIXI.Container {
    /**
     * @param origin  - The canvas coordinates of the origin of the ping.
     * @param options - Additional options to configure the ping animation.
     */
    constructor(origin: Canvas.Point, options?: PingOptions);

    options: PingOptions;

    _color: Color;

    override destroy(options?: PIXI.IDestroyOptions | boolean): void;

    /**
     * Start the ping animation.
     * @returns Returns true if the animation ran to completion, false otherwise.
     * @privateRemarks This calls `CanvasAnimation.animate` with an empty array for the first argument,
     * meaning no chance of early return, so no `| void` in the return type
     */
    animate(): Promise<boolean>;

    /**
     * On each tick, advance the animation.
     * @param dt        - The number of ms that elapsed since the previous frame.
     * @param animation - The animation state.
     */
    protected _animateFrame(dt: number, animation: CanvasAnimationData): void;
  }

  namespace Ping {
    interface Any extends AnyPing {}
    type AnyConstructor = typeof AnyPing;

    /** @internal */
    type _Options = IntentionalPartial<{
      /**
       * The duration of the animation in milliseconds.
       * @defaultValue `900`
       * @remarks Can't be `null` or `undefined` because `options` is `mergeObject`ed with an object with this key
       */
      duration: number;

      /**
       * The size of the ping graphic.
       * @defaultValue `128`
       * @remarks Can't be `null` or `undefined` because `options` is `mergeObject`ed with an object with this key
       */
      size: number;

      /**
       * The color of the ping graphic.
       * @defaultValue `#ff6400`
       * @remarks Can't be `null` or `undefined` because `options` is `mergeObject`ed with an object with this key
       */
      color: string;

      /**
       * The name for the ping animation to pass to {@link CanvasAnimation.animate}.
       */
      name?: string | undefined | null;
    }>;
  }

  interface PingOptions extends Ping._Options {}
}

declare abstract class AnyPing extends Ping {
  constructor(arg0: never, ...args: never[]);
}
