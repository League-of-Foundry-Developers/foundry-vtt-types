export {};

declare global {
  /**
   * A CanvasLayer for displaying coloration visual effects
   */
  class CanvasColorationEffects extends CanvasLayer {
    /**
     * @defaultValue `true`
     */
    override sortableChildren: boolean;

    /**
     * The filter used to mask visual effects on this layer
     */
    filter: VisualEffectsMaskingFilter;

    /**
     * Clear coloration effects container
     */
    clear(): void;

    /**
     * @param options - Unused
     */
    protected override _draw(options?: Record<string, unknown> | undefined): Promise<void>;

    /**
     * @param options - Unused
     */
    protected override _tearDown(options?: Record<string, unknown> | undefined): Promise<void>;
  }
}
