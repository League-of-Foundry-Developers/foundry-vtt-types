export {};

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
}
