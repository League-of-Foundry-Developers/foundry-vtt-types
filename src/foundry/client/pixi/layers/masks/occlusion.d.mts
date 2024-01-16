export {};

declare global {
  /**
   * The occlusion mask which contains radial occlusion and vision occlusion from tokens.
   */
  class CanvasOcclusionMask extends CachedContainer {
    /**
     * @defaultValue
     * ```js
     * {
     *   scaleMode: PIXI.SCALE_MODES.NEAREST,
     *   format: PIXI.FORMATS.RGB
     * }
     * ```
     */
    static override textureConfiguration: {
      scaleMode: PIXI.SCALE_MODES;
      format: PIXI.FORMATS;
    };

    /**
     * Graphics in which token radial and vision occlusion shapes are drawn.
     */
    tokens: PIXI.LegacyGraphics;

    /**
     * @defaultValue `[1, 1, 1, 1]`
     */
    override clearColor: [r: number, g: number, b: number, a: number];

    /**
     * Clear the occlusion mask.
     */
    clear(): void;

    /**
     * Update the state of occlusion, rendering a new occlusion mask and updating the occluded flag on all Tiles.
     */
    updateOcclusion(): void;

    /**
     * Determine the set of objects which should be currently occluded by a Token.
     * @param tokens - The set of currently controlled Token objects
     * @returns The PCO objects which should be currently occluded
     */
    protected _identifyOccludedObjects(tokens: Token[]): Set<InstanceType<ReturnType<typeof PrimaryCanvasObjectMixin>>>;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks `"CanvasOcclusionMask#_identifyOccludedTiles has been deprecated in favor of CanvasOcclusionMask#_identifyOccludedObjects."`
     */
    _identifyOccludedTiles(): Set<typeof PrimaryCanvasObjectMixin>;
  }
}
