import type { Identity } from "fvtt-types/utils";

declare global {
  /**
   * The depth mask which contains a mapping of elevation. Needed to know if we must render objects according to depth.
   * Red channel: Lighting occlusion (top).
   * Green channel: Lighting occlusion (bottom).
   * Blue channel: Weather occlusion.
   */
  class CanvasDepthMask extends CachedContainer {
    /**
     * Container in which roofs are rendered with depth data.
     */
    roofs: PIXI.Container;

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
     * @defaultValue `[0, 0, 0, 0]`
     */
    override clearColor: Color.RGBAColorVector;

    /**
     * Update the elevation-to-depth mapping?
     */
    protected _elevationDirty: boolean;

    /**
     * Map an elevation to a value in the range [0, 1] with 8-bit precision.
     * The depth-rendered object are rendered with these values into the render texture.
     * @param elevation - The elevation in distance units
     * @returns The value for this elevation in the range [0, 1] with 8-bit precision
     */
    mapElevation(elevation: number): number;

    /**
     * Update the elevation-to-depth mapping.
     * Needs to be called after the children have been sorted
     * and the canvas transform phase.
     */
    protected _update(): void;

    /**
     * Clear the depth mask.
     */
    clear(): void;
  }

  namespace CanvasDepthMask {
    interface Any extends AnyCanvasDepthMask {}
    interface AnyConstructor extends Identity<typeof AnyCanvasDepthMask> {}
  }
}

declare abstract class AnyCanvasDepthMask extends CanvasDepthMask {
  constructor(...args: never);
}
