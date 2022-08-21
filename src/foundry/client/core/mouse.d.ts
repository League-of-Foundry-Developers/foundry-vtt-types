/** Management class for Mouse events */
declare class MouseManager {
  constructor();

  /**
   * Specify a rate limit for mouse wheel to gate repeated scrolling.
   * This is especially important for continuous scrolling mice which emit hundreds of events per second.
   * This designates a minimum number of milliseconds which must pass before another wheel event is handled
   * @defaultValue `50`
   */
  static MOUSE_WHEEL_RATE_LIMIT: number;

  /**
   * Master mouse-wheel event handler
   * @param event - The mouse wheel event
   * @internal
   */
  protected _onWheel(event: MouseEvent): void;
}
