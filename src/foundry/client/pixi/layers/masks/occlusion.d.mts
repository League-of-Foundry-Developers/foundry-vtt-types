export {};

declare global {
  /**
   * The occlusion mask which contains radial occlusion and vision occlusion from tokens.
   * Red channel: Fade occlusion.
   * Green channel: Radial occlusion.
   * Blue channel: Vision occlusion.
   */
  class CanvasOcclusionMask extends CachedContainer {
    /**
     * @defaultValue
     * ```js
     * {
     *   scaleMode: PIXI.SCALE_MODES.NEAREST,
     *   format: PIXI.FORMATS.RGB,
     *   multisample: PIXI.MSAA_QUALITY.NONE
     * }
     * ```
     */
    static override textureConfiguration: CachedContainer.TextureConfiguration;

    /**
     * Graphics in which token radial and vision occlusion shapes are drawn.
     * @remarks The `blendMode` of this `LegacyGraphics` is set to `PIXI>BLEND_MODES.MIN_ALL`
     */
    tokens: PIXI.LegacyGraphics;

    /**
     * @defaultValue `[0, 1, 1, 1]`
     */
    override clearColor: Color.RGBAColorVector;

    override autoRender: boolean;

    /**
     * Is vision occlusion active?
     */
    get vision(): boolean;

    /** @remarks No setter is provided */
    set vision(value: never);

    /**
     * Clear the occlusion mask.
     */
    clear(): void;

    /**
     * Map an elevation to a value in the range [0, 1] with 8-bit precision.
     * The radial and vision shapes are drawn with these values into the render texture.
     * @param elevation - The elevation in distance units
     * @returns The value for this elevation in the range [0, 1] with 8-bit precision
     */
    mapElevation(elevation: number): number;

    /**
     * Update the set of occludable Tokens, redraw the occlusion mask, and update the occluded state
     * of all occludable objects.
     */
    updateOcclusion(): void;

    /**
     * Draw occlusion shapes to the occlusion mask.
     * Fade occlusion draws to the red channel with varying intensity from [0, 1] based on elevation.
     * Radial occlusion draws to the green channel with varying intensity from [0, 1] based on elevation.
     * Vision occlusion draws to the blue channel with varying intensity from [0, 1] based on elevation.
     */
    protected _updateOcclusionMask(): void;

    /**
     * Update the current occlusion status of all Tile objects.
     */
    protected _updateOcclusionStates(): void;

    /**
     * Determine the set of objects which should be currently occluded by a Token.
     * @param tokens - The set of currently controlled Token objects
     * @returns The PCO objects which should be currently occluded
     */
    protected _identifyOccludedObjects(tokens: Token.ConfiguredInstance[]): Set<PrimaryCanvasObjectMixin.AnyMixed>;

    /**
     * @deprecated since v11, will be removed in v13
     * @remarks "CanvasOcclusionMask#_identifyOccludedTiles has been deprecated in favor of CanvasOcclusionMask#_identifyOccludedObjects."
     */
    _identifyOccludedTiles(): Set<PrimaryCanvasObjectMixin.AnyMixed>;
  }

  namespace CanvasOcclusionMask {
    interface Any extends AnyCanvasOcclusionMask {}
    type AnyConstructor = typeof AnyCanvasOcclusionMask;
  }
}

declare abstract class AnyCanvasOcclusionMask extends CanvasOcclusionMask {
  constructor(arg0: never, ...args: never[]);
}
