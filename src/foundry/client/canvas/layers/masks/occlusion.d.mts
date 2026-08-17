import type { AnyObject, DeepReadonly, Identity } from "#utils";
import type { CachedContainer } from "#client/canvas/containers/_module.d.mts";
import type { PrimaryCanvasObjectMixin } from "#client/canvas/primary/_module.d.mts";
import type { Token } from "#client/canvas/placeables/_module.d.mts";
import type { RegionDocument } from "#client/documents/_module.d.mts";

/**
 * The occlusion mask which contains radial occlusion and vision occlusion from tokens.
 * Red channel: Fade occlusion.
 * Green channel: Radial occlusion.
 * Blue channel: Vision occlusion.
 * Alpha channel: Surface occlusion.
 */
declare class CanvasOcclusionMask extends CachedContainer {
  /**
   * @defaultValue
   * ```js
   * {
   *   scaleMode: PIXI.SCALE_MODES.NEAREST,
   *   format: PIXI.FORMATS.RGBA,
   *   multisample: PIXI.MSAA_QUALITY.NONE
   * }
   * ```
   */
  static override textureConfiguration: CachedContainer.TextureConfiguration;

  /**
   * Graphics in which token radial and vision occlusion shapes are drawn.
   * @remarks The `blendMode` of this `LegacyGraphics` is set to `PIXI.BLEND_MODES.MIN_ALL`
   */
  tokens: PIXI.LegacyGraphics;

  /**
   * Graphics in which surface occlusion shapes are drawn.
   * @remarks The `blendMode` of this `LegacyGraphics` is set to `PIXI.BLEND_MODES.MIN_ALL`, and its
   * `mask` to a `PIXI.MaskData` with an `ALPHA` color mask.
   */
  surfaces: PIXI.LegacyGraphics;

  /**
   * @defaultValue `[0, 1, 1, 1]`
   */
  override clearColor: Color.RGBAColorVector;

  /**
   * @defaultValue `false`
   */
  override autoRender: boolean;

  /**
   * The set of currently occluded canvas objects.
   */
  get occluded(): Set<PrimaryCanvasObjectMixin.AnyMixed>;

  /**
   * The occluded surfaces.
   */
  get occludedSurfaces(): ReadonlySet<DeepReadonly<RegionDocument.Surface>>;

  /**
   * Is vision occlusion active?
   */
  get vision(): boolean;

  /**
   * Clear the occlusion mask.
   */
  override clear(): this;

  /**
   * Map an elevation to a value in the range (0, 1] with 8-bit precision.
   * The radial and vision shapes are drawn with these values into the render texture.
   * @param elevation - The elevation in distance units
   * @returns The value for this elevation in the range (0, 1] with 8-bit precision
   */
  mapElevation(elevation: number): number;

  /**
   * Update the occludable tokens.
   * @internal
   */
  _updateOccludableTokens(): void;

  /**
   * Draw occlusion shapes to the occlusion mask.
   * Fade occlusion draws to the red channel with varying intensity from [0, 1] based on elevation.
   * Radial occlusion draws to the green channel with varying intensity from [0, 1] based on elevation.
   * Vision occlusion draws to the blue channel with varying intensity from [0, 1] based on elevation.
   * Surface occlusion draws to the alpha channel with varying intensity from [0, 1] based on elevation.
   */
  protected _updateOcclusionMask(): void;

  /**
   * Update the current occlusion status of all PCOs.
   * @internal
   */
  _updateOccludedObjects(): void;

  /**
   * Determine the set of objects which should be currently occluded by a Token.
   * @param tokens - The occludable Tokens
   * @returns The PCO objects which should be currently occluded
   */
  protected _identifyOccludedObjects(tokens: Token.Implementation[]): Set<PrimaryCanvasObjectMixin.AnyMixed>;

  /**
   * Determine the occluded surfaces.
   * @param flags - The perception render flags that are processed
   * @internal
   */
  _updateOccludedSurfaces(flags: AnyObject): void;

  /**
   * @deprecated "`CanvasOcclusionMask#updateOcclusion` is deprecated. Use
   * `canvas.perception.update({refreshOcclusion: true})` instead." (since v14, until v16)
   * @see {@linkcode foundry.canvas.perception.PerceptionManager.update | PerceptionManager#update}
   */
  updateOcclusion(): void;
}

declare namespace CanvasOcclusionMask {
  interface Any extends AnyCanvasOcclusionMask {}
  interface AnyConstructor extends Identity<typeof AnyCanvasOcclusionMask> {}
}

export default CanvasOcclusionMask;

declare abstract class AnyCanvasOcclusionMask extends CanvasOcclusionMask {
  constructor(...args: never);
}
