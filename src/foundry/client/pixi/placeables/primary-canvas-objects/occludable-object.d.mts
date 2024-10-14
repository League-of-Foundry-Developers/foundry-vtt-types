import type { Mixin } from "../../../../../types/utils.d.mts";
import type { OCCLUSION_MODES } from "../../../../common/constants.d.mts";

declare class OccludableObject {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * @defaultValue
   * ```js
   * return foundry.utils.mergeObject(super.defaultData, {
   *    roof: false,
   *    occlusion: {
   *        mode: CONST.OCCLUSION_MODES.NONE,
   *        alpha: 0,
   *        radius: null
   *    }
   * })
   * ```
   */
  static get defaultData(): OccludableObjectData;

  /**
   * Contains :
   * - the bounds of the texture data
   * - the cached mapping of non-transparent pixels (if roof)
   * - the filtered render texture (if roof)
   */
  protected _textureData: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    pixels: Uint8Array;
    texture: PIXI.RenderTexture;
  };

  /**
   * A flag which tracks whether the primary canvas object is currently in an occluded state.
   * @defaultValue `false`
   */
  occluded: boolean;

  /**
   * Force or cancel the rendering of the PCO depth. If undefined, the underlying logic decide.
   * @defaultValue `false`
   */
  forceRenderDepth: boolean;

  /**
   * Is this occludable object... occludable?
   */
  get isOccludable(): boolean;

  /**
   * Should this PCO render its depth?
   */
  get shouldRenderDepth(): boolean;

  /**
   * Debounce assignment of the PCO occluded state to avoid cases like animated token movement which can rapidly
   * change PCO appearance.
   * Uses a 50ms debounce threshold.
   */
  debounceSetOcclusion: (occluded: boolean) => void;

  /**
   * Compute and returns the normal and occlusion alpha for this occludable object.
   */
  protected _getOcclusionAlpha(): { alphaNormal: number; alphaOccluded: number };

  /**
   * Refresh the appearance of the occlusion state for tiles which are affected by a Token beneath them.
   */
  refreshOcclusion(): void;

  /**
   * Render the depth of this primary canvas object.
   */
  renderDepthData(renderer: PIXI.Renderer): void;

  /**
   * Process the PCO texture :
   * Use the texture to create a cached mapping of pixel alpha for this Tile with real base texture size.
   * Cache the bounding box of non-transparent pixels for the un-rotated shape.
   */
  updateTextureData(): { minX: number; minY: number; maxX: number; maxY: number; pixels: Uint8Array | undefined };

  /**
   * Test whether a specific Token occludes this PCO.
   * Occlusion is tested against 9 points, the center, the four corners-, and the four cardinal directions
   * @param token   - The Token to test
   * @param options - Additional options that affect testing
   * @returns Is the Token occluded by the PCO?
   */
  testOcclusion(
    token: Token,
    options?: {
      /** Test corners of the hit-box in addition to the token center? */
      corners?: boolean;
    },
  ): boolean;

  /**
   * Test whether the PCO pixel data contains a specific point in canvas space
   * @param alphaThreshold - Value from which the pixel is taken into account, in the range [0, 1].
   *                         (default: `0.75`)
   */
  containsPixel(x: number, y: number, alphaThreshold?: number): boolean;

  /**
   * Get alpha value at specific canvas coordinate.
   * @returns The alpha value (-1 if outside of the bounds) or null if no mesh or texture is present.
   */
  getPixelAlpha(x: number, y: number): number | null;

  /**
   * Get PCO alpha map texture coordinate with canvas coordinate
   * @param testX - Canvas x coordinate.
   * @param testY - Canvas y coordinate.
   * @returns The texture `{x, y}` coordinates, or null if not able to do the conversion.
   */
  protected _getTextureCoordinate(testX: number, testY: number): { x: number; y: number } | null;

  /**
   * Compute the alpha-based bounding box for the tile, including an angle of rotation.
   * @internal
   */
  protected _getAlphaBounds(): PIXI.Rectangle;

  /**
   * @deprecated since v11, will be removed in v13
   * @remarks "PrimaryCanvasObject#renderOcclusion is deprecated in favor of PrimaryCanvasObject#renderDepth"
   */
  renderOcclusion(renderer: PIXI.Renderer): void;
}

declare global {
  interface OccludableObjectData extends PrimaryCanvasObjectData {
    /**
     * The PCO is considered as a roof?
     * @defaultValue false
     */
    roof: boolean;

    /** The occlusion object for this PCO */
    occlusion: {
      /** @defaultValue `CONST.OCCLUSION_MODES.NONE` */
      mode: OCCLUSION_MODES;
      /** @defaultValue `0` */
      alpha: number;
      /** @defaultValue `null` */
      radius: number | null;
    };
  }

  /**
   * A mixin which decorates a DisplayObject with depth and/or occlusion properties.
   * @param DisplayObject - The parent DisplayObject class being mixed
   * @returns A DisplayObject subclass mixed with OccludableObject features
   */
  // It's vaguely nonsensical that OccludableObjectMixin extends PrimaryCanvasObjectMixin because PrimaryCanvasObjectMixin's first parameter is incompatible.
  // It mostly works at runtime because the defaults will be used.
  function OccludableObjectMixin<BaseClass extends OccludableObjectMixin.BaseClass>(
    DisplayObject: BaseClass,
  ): Mixin<typeof OccludableObject, Mixin<PrimaryCanvasObjectMixin.MixinClass, BaseClass>>;

  namespace OccludableObjectMixin {
    interface BaseClass extends SpriteMeshClass {
      new (texture: PIXI.Texture): SpriteMesh;
    }
  }
}

type SpriteMeshClass = typeof SpriteMesh;
