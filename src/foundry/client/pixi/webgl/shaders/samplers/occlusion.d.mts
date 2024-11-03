export {};

declare abstract class AnyOccludableSamplerShader extends OccludableSamplerShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace OccludableSamplerShader {
    type AnyConstructor = typeof AnyOccludableSamplerShader;

    interface OccludableBatchData extends PIXI.IBatchableElement {
      elevation: number;
      unoccludedAlpha: number;
      occludedAlpha: number;
      fadeOcclusion: number;
      radialOcclusion: number;
      visionOcclusion: number;
    }
  }
  /**
   * An occlusion shader to reveal certain area with elevation comparisons.
   * This shader is also working as a batched plugin.
   */
  class OccludableSamplerShader extends BaseSamplerShader {
    /**
     * @defaultValue `"batchOcclusion"`
     */
    static override classPluginName: string;

    /**
     * @remarks this is a guess; autofill produces just `BatchGeometry`
     * without the typeof which immediately starts yelling
     */
    static override batchGeometry: BaseSamplerShader.BatchGeometry;

    /**
     * @defaultValue `7`
     */
    static override batchVertexSize: number;

    /**
     * @defaultValue `1`
     */
    static reservedTextureUnits: number;

    /**
     * @defaultValue
     * ```js
     * {
     *   screenDimensions: [1, 1],
     *   sampler: null,
     *   tintAlpha: [1, 1, 1, 1],
     *   occlusionTexture: null,
     *   unoccludedAlpha: 1,
     *   occludedAlpha: 0,
     *   occlusionElevation: 0,
     *   fadeOcclusion: 0,
     *   radialOcclusion: 0,
     *   visionOcclusion: 0
     * }
     * ```
     */
    static override batchDefaultUniforms: BatchRenderer.BatchDefaultUniformsFunction;

    protected static override _preRenderBatch: BatchRenderer.PreRenderBatchFunction;

    protected static override _packInterleavedGeometry(
      element: OccludableSamplerShader.OccludableBatchData,
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

    static override get fragmentShader(): AbstractBaseShader.FragmentShader;

    /**
     * The fragment shader source. Subclasses can override it.
     */
    protected static _fragmentShader: string;

    static override defaultUniforms: AbstractBaseShader.Uniforms;

    protected override _preRender(mesh: PIXI.DisplayObject, renderer: PIXI.Renderer): void;
  }
}
