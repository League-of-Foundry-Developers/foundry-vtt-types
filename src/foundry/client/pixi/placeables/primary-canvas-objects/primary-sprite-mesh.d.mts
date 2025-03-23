import type { Identity, InexactPartial, NullishProps } from "fvtt-types/utils";

declare global {
  /**
   * A basic PCO sprite mesh which is handling occlusion and depth.
   */
  class PrimarySpriteMesh extends PrimaryOccludableObjectMixin(SpriteMesh) {
    constructor(
      /**
       * The constructor options.
       * @defaultValue `{}`
       * @remarks Default is applied if `options` is `instanceof PIXI.Texture`, or neither that nor `instanceof Object`
       */
      options?: PrimarySpriteMesh.ConstructorOptions | PIXI.Texture | null,
      /**
       * The shader class used to render this sprite.
       * @defaultValue `PrimaryBaseSamplerShader`
       * @remarks If `options` is an object, `options.shaderClass` takes precedence. If omitted,
       * or if `options` is a `PIXI.Texture`, default is provided by `??` in function body.
       */
      shaderClass?: PrimaryBaseSamplerShader.AnyConstructor | null,
    );

    /**
     * The texture alpha data.
     */
    protected _textureAlphaData: TextureLoader.TextureAlphaData | null;

    /**
     * The texture alpha threshold used for point containment tests.
     * If set to a value larger than 0, the texture alpha data is
     * extracted from the texture at 25% resolution.
     * @defaultValue `0`
     */
    textureAlphaThreshold: number;

    override _onTextureUpdate(): void;

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
     * - (default) "fill" computes the exact width and height ratio.
     * - "cover" takes the maximum ratio of width and height and applies it to both.
     * - "contain" takes the minimum ratio of width and height and applies it to both.
     * - "width" applies the width ratio to both width and height.
     * - "height" applies the height ratio to both width and height.
     *
     * You can also apply optional scaleX and scaleY options to both width and height. The scale is applied after fitting.
     *
     * **Important**: By using this helper, you don't need to set the height, width, and scale properties of the DisplayObject.
     *
     * **Note**: This is a helper method. Alternatively, you could assign properties as you would with a PIXI DisplayObject.
     * @param baseWidth  - The base width used for computations.
     * @param baseHeight - The base height used for computations.
     * @param options    - The options.
     * @throws If either `baseWidth` or `baseHeight` are less than 0, or if `options.fit` is not a FitType
     */
    resize(baseWidth: number, baseHeight: number, options?: PrimarySpriteMesh.ResizeOptions): void;

    protected override _updateBatchData(): void;

    protected override _calculateCanvasBounds(): void;

    /**
     * Is the given point in canvas space contained in this object?
     * @param point                 - The point in canvas space
     * @param textureAlphaThreshold - The minimum texture alpha required for containment
     */
    containsCanvasPoint(
      point: PIXI.IPointData,
      /** @defaultValue `this.textureAlphaThreshold` */
      textureAlphaThreshold?: number,
    ): boolean;

    /**
     * Is the given point in world space contained in this object?
     * @param point                 - The point in world space
     * @param textureAlphaThreshold - The minimum texture alpha required for containment
     */
    containsPoint(
      point: PIXI.IPointData,
      /** @defaultValue `this.textureAlphaThreshold` */
      textureAlphaThreshold?: number,
    ): boolean;

    override renderDepthData(renderer: PIXI.Renderer): void;

    /**
     * Render the sprite with ERASE blending.
     * Note: The sprite must not have visible/renderable children.
     * @param renderer - The renderer
     */
    protected _renderVoid(renderer: PIXI.Renderer): void;

    /**
     * @deprecated since v12, will be removed in v14
     * @remarks "#getPixelAlpha is deprecated without replacement."
     */
    getPixelAlpha(x: number, y: number): number;

    /**
     * @deprecated since v12, until v14
     * @remarks "#_getAlphaBounds is deprecated without replacement."
     */
    _getAlphaBounds(): PIXI.Rectangle;

    /**
     * @deprecated since v12, until v14
     * @remarks "#_getTextureCoordinate is deprecated without replacement."
     */
    _getTextureCoordinate(testX: number, testY: number): PIXI.IPointData;
  }

  namespace PrimarySpriteMesh {
    interface Any extends AnyPrimarySpriteMesh {}
    interface AnyConstructor extends Identity<typeof AnyPrimarySpriteMesh> {}

    type FitType = "fill" | "cover" | "contain" | "width" | "height";

    /** @internal */
    type _ConstructorOptions = NullishProps<{
      /**
       * Texture passed to the SpriteMesh.
       * @defaultValue `null`
       * @remarks Default ultimately provided by the `SpriteMesh` constructor
       */
      texture: PIXI.Texture;

      /**
       * The shader class used to render this sprite.
       * @defaultValue `PrimaryBaseSamplerShader`
       * @remarks Default provided by `??=` in function body
       */
      shaderClass: PrimaryBaseSamplerShader.AnyConstructor;

      /**
       * The name of this sprite.
       * @defaultValue `null`
       * @remarks Default provided by `?? null` in function body
       */
      name: string;

      /**
       * Any object that owns this PCO.
       * @defaultValue `null`
       * @remarks Default via `?? null` in function body
       * @privateRemarks Foundry types as `*`, but the only things passed in practice are `Tile`s, `Token`s, and the `PrimaryCanvasGroup`
       */
      //TODO: (esheyw) Revisit the "any canvas group" type when groups are done
      object: PlaceableObject.Any | CanvasGroupMixin.AnyMixed;
    }>;

    /** The constructor options */
    interface ConstructorOptions extends _ConstructorOptions {}

    /** @internal */
    type _ResizeOptions = InexactPartial<{
      /**
       * The fit type.
       * @defaultValue `"fill"`
       * @remarks Can't be `null` because it only has a parameter default, and is then fed into a switch statement where the default is throw
       * */
      fit: FitType;

      /**
       * The scale on X axis.
       * @defaultValue `1`
       * @remarks Can't be `null` because it only has a parameter default and a width scale of 0 is, if not nonsensical, not to be done by accident.
       */
      scaleX: number;

      /**
       * The scale on Y axis.
       * @defaultValue `1`
       * @remarks Can't be `null` because it only has a parameter default and a height scale of 0 is, if not nonsensical, not to be done by accident.
       */
      scaleY: number;
    }>;

    interface ResizeOptions extends _ResizeOptions {}
  }
}

declare abstract class AnyPrimarySpriteMesh extends PrimarySpriteMesh {
  constructor(...args: never);
}
