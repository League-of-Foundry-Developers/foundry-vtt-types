export {};

type CanvasVisionContainer = unknown;

declare global {
  /**
   * The visibility Layer which implements dynamic vision, lighting, and fog of war
   * This layer uses an event-driven workflow to perform the minimal required calculation in response to changes.
   * @see {@link PointSource}
   */
  class CanvasVisibility extends CanvasLayer {
    /**
     * The exploration container which tracks exploration progress
     */
    explored: PIXI.Container;

    /**
     * The container of current vision exploration
     */
    vision: CanvasVisionContainer;
  }
}
