declare global {
  /**
   * An extension of PIXI.Mesh which emulate a PIXI.Sprite with a specific shader.
   */
  // @ts-expect-error Foundry incorrectly overrode the private property _transformID
  class SpriteMesh extends PIXI.Mesh {
    /**
     * @param texture   - Texture bound to this sprite mesh.
     * @param shaderCls - Shader class used by this sprite mesh.
     */
    constructor(texture: PIXI.Texture, shaderCls: BaseSamplerShader);

    /**
     * Snapshot of some parameters of this display object to render in batched mode.
     * TODO: temporary object until the upstream issue is fixed: https://github.com/pixijs/pixijs/issues/8511
     */
    protected _batchData: {
      _tintRGB: number;
      _texture: PIXI.Texture;
      indices: number[];
      uvs: number[];
      blendMode: PIXI.BLEND_MODES;
      vertexData: number[];
      worldAlpha: number;
    };

    /** @defaultValue `-1` */
    override _transformID: number;

    /** @defaultValue `-1` */
    _textureID: number;

    /** @defaultValue `-1` */
    _textureTrimmedID: number;

    /** @defaultValue `-1` */
    _transformTrimmedID: number;

    /**
     * Forced to false for SpriteMesh
     * @defaultValue `false`
     */
    override _roundPixels: boolean;

    /** @defaultValue `null` */
    vertexTrimmedData: null;

    override isSprite: boolean;

    /**
     * Used to force an alpha mode on this sprite mesh.
     * If this property is non null, this value will replace the texture alphaMode when computing color channels.
     * Affects how tint, worldAlpha and alpha are computed each others.
     */
    get alphaMode(): PIXI.ALPHA_MODES | undefined;

    set alphaMode(mode);

    /**
     * Returns the SpriteMesh associated batch plugin. By default the returned plugin is that of the associated shader.
     * If a plugin is forced, it will returns the forced plugin.
     */
    get pluginName(): string;

    set pluginName(name);

    override get width(): number;

    override set width(width);

    _width: number;

    override get texture(): PIXI.Texture;

    override set texture(texture);

    _texture: PIXI.Texture;

    get anchor(): PIXI.ObservablePoint;

    set anchor(anchor);

    _anchor: PIXI.ObservablePoint;

    override get tint(): PIXI.ColorSource;

    override set tint(tint);

    /** @defaultValue `new PIXI.Color(0xFFFFFF)` */
    _tintColor: PIXI.Color;

    /** @defaultValue `0xFFFFFF` */
    _tintRGB: number;

    /**
     * The HTML source element for this SpriteMesh texture.
     */
    get sourceElement(): HTMLImageElement | HTMLVideoElement | null;

    /**
     * Is this SpriteMesh rendering a video texture?
     */
    get isVideo(): boolean;

    _onTextureUpdate(): void;

    _onAnchorUpdate(): void;

    /**
     * Update uvs and push vertices and uv buffers on GPU if necessary.
     */
    updateUvs(): void;

    /**
     * Initialize shader based on the shader class type.
     * @param shaderCls - Shader class used. Must inherit from AbstractBaseShader.
     */
    setShaderClass(shaderCls: typeof AbstractBaseShader): void;

    /** @privateRemarks Docs have a parentTransform argument, but it's only used in super.updateTransform(parentTransform) - which doesn't actually take an argument*/
    override updateTransform(): void;

    override calculateVertices(): void;

    calculateTrimmedVertices(): void;

    override _render(renderer: PIXI.Renderer): void;

    override _renderToBatch(renderer: PIXI.Renderer): void;

    override _renderDefault(renderer: PIXI.Renderer): void;

    /**
     * Update the batch data object.
     * TODO: temporary method until the upstream issue is fixed: https://github.com/pixijs/pixijs/issues/8511
     */
    protected _updateBatchData(): void;

    override _calculateBounds(): void;

    override getLocalBounds(rect: PIXI.Rectangle): PIXI.Rectangle;

    override containsPoint(point: PIXI.IPointData): boolean;

    override destroy(options: PIXI.IDestroyOptions | boolean): void;

    /**
     * Create a SpriteMesh from another source.
     * You can specify texture options and a specific shader class derived from AbstractBaseShader.
     * @param source         - Source to create texture from.
     * @param textureOptions - See {@link PIXI.BaseTexture}'s constructor for options.
     * @param shaderCls      - The shader class to use. BaseSamplerShader by default.
     */
    static from(
      source: string | PIXI.Texture | HTMLCanvasElement | HTMLVideoElement,
      textureOptions?: PIXI.IBaseTextureOptions,
      shaderCls?: typeof AbstractBaseShader,
    ): SpriteMesh;
  }
}
