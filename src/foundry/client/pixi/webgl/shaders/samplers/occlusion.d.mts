import type { BatchGeometry } from "pixi.js";

export {};

declare global {
  namespace OccludableSamplerShader {
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
    static override batchGeometry: typeof BatchGeometry;

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
     *   screenDimensions: [1, 1];
     *   occlusionTexture: maxTex;
     * }
     * ```
     */
    static override batchDefaultUniforms(maxTex: AbstractBaseShader.UniformValue): AbstractBaseShader.Uniforms;

    protected static override _preRenderBatch(): ((batchRenderer: typeof BatchRenderer) => void) | undefined;

    /**
     * @remarks The first argument for the following function should be of type
     * OccludableSampleShader.OccludableBatchData but TS really doesn't like the
     * signature changing. Unsure how to resolve.
     */
    protected static override _packInterleavedGeometry(
      element: PIXI.IBatchableElement,
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

    static override defaultUniforms: AbstractBaseShader.Uniforms;

    protected override _preRender(mesh: PIXI.DisplayObject, renderer: PIXI.Renderer): void;
  }
}
