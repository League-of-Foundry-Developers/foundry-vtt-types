import type { Identity, InexactPartial } from "#utils";
import type { PrimaryBaseSamplerShader } from "#client/canvas/rendering/shaders/_module.d.mts";
import type { TextureLoader } from "#client/canvas/_module.d.mts";
import type { SpriteMesh } from "#client/canvas/containers/_module.mjs";
import type { PrimaryOccludableObjectMixin } from "./_module.d.mts";
import type { CanvasGroupMixin } from "#client/canvas/groups/_module.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";

/**
 * A basic PCO sprite mesh which is handling occlusion and depth.
 */
declare class PrimarySpriteMesh extends PrimaryOccludableObjectMixin(SpriteMesh) {
  /**
   * @param options     - Constructor options or a Texture
   * @param shaderClass - A shader class for the sprite (default: {@linkcode foundry.canvas.rendering.shaders.PrimaryBaseSamplerShader | PrimaryBaseSamplerShader})
   * @remarks If `options` is an object, `options.shaderClass` takes precedence over the `shaderClass` argument.
   */
  constructor(
    options?: PrimarySpriteMesh.ConstructorOptions | PIXI.Texture,
    shaderClass?: PrimaryBaseSamplerShader.AnyConstructor,
  );

  /** @privateRemarks Fake type override, {@linkcode _updateBatchData} dumps a bunch of extra properties in with no documentation */
  protected override _batchData: PrimarySpriteMesh.BatchData;

  /**
   * The texture alpha data.
   * @defaultValue `null`
   */
  protected _textureAlphaData: TextureLoader.TextureAlphaData | null | undefined;

  /**
   * The texture alpha threshold used for point containment tests. If set to a value larger than 0, the texture alpha data is
   * extracted from the texture at 25% resolution.
   * @defaultValue `0`
   */
  textureAlphaThreshold: number;

  protected override _onTextureUpdate(): void;

  override setShaderClass(shaderClass: PrimaryBaseSamplerShader.AnyConstructor): void;

  /**
   * An all-in-one helper method: Resizing the PCO according to desired dimensions and options.
   * This helper computes the width and height based on the following factors:
   *
   * - The ratio of texture width and base width.
   * - The ratio of texture height and base height.
   *
   * Additionally, It takes into account the desired fit options:
   *
   * - (default) `"fill"` computes the exact width and height ratio.
   * - `"cover"` takes the maximum ratio of width and height and applies it to both.
   * - `"contain"` takes the minimum ratio of width and height and applies it to both.
   * - `"width"` applies the width ratio to both width and height.
   * - `"height"` applies the height ratio to both width and height.
   *
   * You can also apply optional `scaleX` and `scaleY` options to both width and height. The scale is applied after fitting.
   *
   * **Important**: By using this helper, you don't need to set the height, width, and scale properties of the DisplayObject.
   *
   * **Note**: This is a helper method. Alternatively, you could assign properties as you would with a PIXI DisplayObject.
   * @param baseWidth  - The base width used for computations.
   * @param baseHeight - The base height used for computations.
   * @param options    - The options.
   * @remarks
   * @throws If either `baseWidth` or `baseHeight` are `>= 0`
   */
  resize(baseWidth: number, baseHeight: number, options?: PrimarySpriteMesh.ResizeOptions): void;

  protected override _updateBatchData(): void;

  protected override _calculateCanvasBounds(): void;

  /**
   * Is the given point in canvas space contained in this object?
   * @param point                 - The point in canvas space
   * @param textureAlphaThreshold - The minimum texture alpha required for containment (default: {@linkcode PrimarySpriteMesh.textureAlphaThreshold | this.textureAlphaThreshold})
   */
  containsCanvasPoint(point: PIXI.IPointData, textureAlphaThreshold?: number): boolean;

  /**
   * Is the given point in world space contained in this object?
   * @param point                 - The point in world space
   * @param textureAlphaThreshold - The minimum texture alpha required for containment (default: {@linkcode PrimarySpriteMesh.textureAlphaThreshold | this.textureAlphaThreshold})
   */
  containsPoint(point: PIXI.IPointData, textureAlphaThreshold?: number): boolean;

  override renderDepthData(renderer: PIXI.Renderer): void;

  /**
   * Render the sprite with {@linkcode PIXI.BLEND_MODES.ERASE | ERASE} blending.
   * Note: The sprite must not have visible/renderable children.
   * @param renderer - The renderer
   * @internal
   */
  protected _renderVoid(renderer: PIXI.Renderer): void;

  /**
   * @deprecated "`#getPixelAlpha `is deprecated without replacement." (since v12, until v14)
   */
  getPixelAlpha(x: number, y: number): number;

  /**
   * @deprecated "`#_getAlphaBounds` is deprecated without replacement." (since v12, until v14)
   */
  _getAlphaBounds(): PIXI.Rectangle;

  /**
   * @deprecated "`#_getTextureCoordinate` is deprecated without replacement." (since v12, until v14)
   */
  _getTextureCoordinate(testX: number, testY: number): PIXI.IPointData;

  #PrimarySpriteMesh: true;
}

declare namespace PrimarySpriteMesh {
  interface Any extends AnyPrimarySpriteMesh {}
  interface AnyConstructor extends Identity<typeof AnyPrimarySpriteMesh> {}

  type FitType = "fill" | "cover" | "contain" | "width" | "height";

  /** @internal */
  type _ConstructorOptions = InexactPartial<{
    /**
     * Texture passed to the SpriteMesh.
     */
    texture: PIXI.Texture;

    /**
     * The name of this sprite.
     */
    name: string | null;

    /**
     * Any object that owns this PCO.
     * @defaultValue `null`
     * @remarks See {@linkcode foundry.canvas.primary.PrimaryCanvasObjectMixin.AnyMixed.object | PrimaryCanvasObject#object}
     */
    object: PlaceableObject.Any | CanvasGroupMixin.AnyMixed | null;

    /**
     * The shader class used to render this sprite.
     * @defaultValue {@linkcode foundry.canvas.rendering.shaders.PrimaryBaseSamplerShader | PrimaryBaseSamplerShader}
     */
    shaderClass: PrimaryBaseSamplerShader.AnyConstructor;
  }>;

  /** The constructor options */
  interface ConstructorOptions extends _ConstructorOptions {}

  /** @internal */
  type _ResizeOptions = InexactPartial<{
    /**
     * The fit type.
     * @defaultValue `"fill"`
     */
    fit: FitType;

    /**
     * The scale on X axis.
     * @defaultValue `1`
     */
    scaleX: number;

    /**
     * The scale on Y axis.
     * @defaultValue `1`
     */
    scaleY: number;
  }>;

  interface ResizeOptions extends _ResizeOptions {}

  /** @internal */
  type _BatchData = InexactPartial<{
    /** @remarks Doesn't exist prior to first render, set in {@linkcode PrimarySpriteMesh._updateBatchData | PrimarySpriteMesh#_updateBatchData} */
    elevation: PrimarySpriteMesh["elevation"];

    /** @remarks Doesn't exist prior to first render, set in {@linkcode PrimarySpriteMesh._updateBatchData | PrimarySpriteMesh#_updateBatchData} */
    textureAlphaThreshold: PrimarySpriteMesh["textureAlphaThreshold"];

    /** @remarks Doesn't exist prior to first render, set in {@linkcode PrimarySpriteMesh._updateBatchData | PrimarySpriteMesh#_updateBatchData} */
    unoccludedAlpha: PrimarySpriteMesh["unoccludedAlpha"];

    /** @remarks Doesn't exist prior to first render, set in {@linkcode PrimarySpriteMesh._updateBatchData | PrimarySpriteMesh#_updateBatchData} */
    occludedAlpha: PrimarySpriteMesh["occludedAlpha"];

    /** @remarks Doesn't exist prior to first render, set in {@linkcode PrimarySpriteMesh._updateBatchData | PrimarySpriteMesh#_updateBatchData} */
    fadeOcclusion: PrimaryOccludableObjectMixin.OcclusionState["fade"];

    /** @remarks Doesn't exist prior to first render, set in {@linkcode PrimarySpriteMesh._updateBatchData | PrimarySpriteMesh#_updateBatchData} */
    radialOcclusion: PrimaryOccludableObjectMixin.OcclusionState["radial"];

    /** @remarks Doesn't exist prior to first render, set in {@linkcode PrimarySpriteMesh._updateBatchData | PrimarySpriteMesh#_updateBatchData} */
    visionOcclusion: PrimaryOccludableObjectMixin.OcclusionState["vision"];

    /** @remarks Doesn't exist prior to first render, set in {@linkcode PrimarySpriteMesh._updateBatchData | PrimarySpriteMesh#_updateBatchData} */
    restrictionState: PrimarySpriteMesh["_restrictionState"];
  }>;

  interface BatchData extends SpriteMesh.BatchData, _BatchData {}
}

export default PrimarySpriteMesh;

declare abstract class AnyPrimarySpriteMesh extends PrimarySpriteMesh {
  constructor(...args: never);
}
