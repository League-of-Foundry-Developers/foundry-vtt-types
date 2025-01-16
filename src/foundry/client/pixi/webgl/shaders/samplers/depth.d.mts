export {};

declare global {
  /**
   * The depth sampler shader.
   */
  class DepthSamplerShader extends BaseSamplerShader {
    /**
     * @defaultValue `"batchDepth"`
     */
    static override classPluginName: string | null;

    static override batchGeometry: BaseSamplerShader.BatchGeometry;

    /**
     * @defaultValue `6`
     */
    static override batchVertexSize: number;

    /**
     * @defaultValue `1`
     */
    static override reservedTextureUnits: number;

    /**
     * @defaultValue
     * ```js
     * {
     *   screenDimensions: [1, 1],
     *   sampler: null,
     *   occlusionTexture: null,
     *   textureAlphaThreshold: 0,
     *   depthElevation: 0,
     *   occlusionElevation: 0,
     *   fadeOcclusion: 0,
     *   radialOcclusion: 0,
     *   visionOcclusion: 0,
     *   restrictsLight: false,
     *   restrictsWeather: false
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    static override batchDefaultUniforms: BatchRenderer.BatchDefaultUniformsFunction;

    static override _preRenderBatch: BatchRenderer.PreRenderBatchFunction;

    protected static override _packInterleavedGeometry(
      element: DepthSamplerShader.DepthBatchData,
      attributeBuffer: PIXI.ViewableBuffer,
      indexBuffer: Uint16Array,
      aIndex: number,
      iIndex: number,
    ): void;

    static override get batchVertexShader(): string;

    /**
     * The batch vertex shader source. Subclasses can override it.
     */
    protected static _batchVertexShader: string;

    static override get batchFragmentShader(): string;

    /**
     * The batch fragment shader source. Subclasses can override it.
     */
    protected static _batchFragmentShader: string;

    static override get vertexShader(): string;

    /**
     * The vertex shader source. Subclasses can override it.
     */
    protected static _vertexShader: string;

    static override get fragmentShader(): string;

    /**
     * The fragment shader source. Subclasses can override it.
     */
    protected static _fragmentShader: string;

    protected override _preRender: AbstractBaseShader.PreRenderFunction;
  }

  namespace DepthSamplerShader {
    interface Any extends AnyDepthSamplerShader {}
    type AnyConstructor = typeof AnyDepthSamplerShader;

    /** @internal */
    type PartialPIXIBatchable = Pick<PIXI.IBatchableElement, "_texture" | "vertexData" | "indices" | "uvs">;

    interface DepthBatchData extends PartialPIXIBatchable {
      elevation: number;
      textureAlphaThreshold: number;
      fadeOcclusion: number;
      radialOcclusion: number;
      visionOcclusion: number;
    }
  }
}

declare abstract class AnyDepthSamplerShader extends DepthSamplerShader {
  constructor(arg0: never, ...args: never[]);
}
