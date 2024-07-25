export {};

declare global {
  /**
   * A layer of background alteration effects which change the appearance of the primary group render texture.
   */
  class CanvasBackgroundAlterationEffects extends CanvasLayer {
    /**
     * A collection of effects which provide background vision alterations.
     * @defaultValue `vision.sortableChildren = true`
     */
    vision: PIXI.Container;

    /**
     * A collection of effects which provide background preferred vision alterations.
     * @defaultValue `visionPreferred.sortableChildren = true`
     */
    visionPreferred: PIXI.Container;

    /**
     * A collection of effects which provide other background alterations.
     */
    lighting: PIXI.Container;

    protected override _draw(options?: Record<string, unknown>): Promise<void>;

    protected override _tearDown(options?: Record<string, unknown>): Promise<void>;

    /**
     * Clear background alteration effects vision and lighting containers
     */
    clear(): void;
  }
}
