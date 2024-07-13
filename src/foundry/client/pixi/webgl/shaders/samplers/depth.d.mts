import type { BatchGeometry } from "pixi.js";

export {};

declare global {
  namespace DepthSamplerShader {
    interface DepthBatchData extends PIXI.IBatchableElement {
      elevation: number;
      textureAlphaThreshold: number;
      fadeOcclusion: number;
      radialOcclusion: number;
      visionOcclusion: number;
    }
  }

  /**
   * The depth sampler shader.
   */
  class DepthSamplerShader extends BaseSamplerShader {
    /**
     * @defaultValue `"batchDepth"`
     */
    static override classPluginName: string | null;

    /**
     * @remarks this is a guess; autofill produces just `BatchGeometry`
     * without the typeof which immediately starts yelling
     */
    static override batchGeometry: typeof BatchGeometry;

    /**
     * @defaultValue `6`
     */
    static override batchVertexSize: number;

    /**
     * @defaultValue `1`
     */
    static override reservedTextureUnits: number;

    static override defaultUniforms: AbstractBaseShader.Uniforms;

    static override batchDefaultUniforms:
      | ((maxTextures: AbstractBaseShader.UniformValue) => AbstractBaseShader.Uniforms)
      | undefined;

    /**
     * @remarks The first argument for the following function should be of type DepthSampleShader.DepthBatchData
     * but TS really doesn't like the signature changing. Unsure how to resolve.
     */
    protected static override _packInterleavedGeometry:
      | ((
          element: PIXI.IBatchableElement,
          attributeBuffer: PIXI.ViewableBuffer,
          indexBuffer: Uint16Array,
          aIndex: number,
          iIndex: number,
        ) => void)
      | undefined;

    static override get batchVertexShader(): string;

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

    protected override _preRender(mesh: PIXI.DisplayObject, renderer: PIXI.Renderer): void;
  }
}
