import type { IDestroyOptions } from "pixi.js";

declare global {
  interface PingOptions {
    /**
     * The duration of the animation in milliseconds.
     * @defaultValue `900`
     */
    duration?: number;

    /**
     * The size of the ping graphic.
     * @defaultValue `128`
     */
    size?: number;

    /**
     * The color of the ping graphic.
     * @defaultValue `#ff6400`
     */
    color?: string;

    /**
     * The name for the ping animation to pass to {@link CanvasAnimation.animate}.
     */
    name?: string;
  }

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

    _color: Color | number;

    destroy(options?: IDestroyOptions | boolean): void;

    /**
     * Start the ping animation.
     * @returns Returns true if the animation ran to completion, false otherwise.
     */
    animate(): Promise<boolean>;

    /**
     * On each tick, advance the animation.
     * @param dt        - The number of ms that elapsed since the previous frame.
     * @param animation - The animation state.
     */
    protected _animateFrame(dt: number, animation: CanvasAnimationData): void;
  }
}
