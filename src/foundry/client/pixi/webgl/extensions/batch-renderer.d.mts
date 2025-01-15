import type { ToMethod, InexactPartial, IntentionalPartial } from "../../../../../utils/index.d.mts";

declare abstract class AnyBatchRenderer extends BatchRenderer {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace BatchRenderer {
    type AnyConstructor = typeof AnyBatchRenderer;

    type PackInterleavedGeometryFunction = ToMethod<
      (
        /**
         * @privateRemarks IntentionalPartial to allow `DepthSamplerShader.DepthBatchData`,
         * which is the type of `DepthSamplerShader._packInterleavedGeometry`'s first poram,
         * to leave off some keys of IBatchableData
         */
        element: IntentionalPartial<PIXI.IBatchableElement>,
        attributeBuffer: PIXI.ViewableBuffer,
        indexBuffer: Uint16Array,
        aIndex: number,
        iIndex: number,
      ) => void
    >;

    type PreRenderBatchFunction = ToMethod<(batchRenderer: typeof BatchRenderer) => void>;

    type BatchDefaultUniformsFunction = ToMethod<(maxTextures: number) => AbstractBaseShader.Uniforms>;

    type ReservedTextureUnits = 0 | 1 | 2 | 3 | 4;

    interface ShaderGeneratorOptions {
      vertex: typeof BatchRenderer.defaultVertexSrc;
      fragment: typeof BatchRenderer.defaultFragmentTemplate;
      uniforms: typeof BatchRenderer.defaultUniforms;
    }
  }

  /**
   * A batch renderer with a customizable data transfer function to packed geometries.
   */
  class BatchRenderer extends PIXI.BatchRenderer {
    /**
     * The batch shader generator class.
     * @defaultValue `BatchShaderGenerator`
     */
    static shaderGeneratorClass: typeof BatchShaderGenerator;

    /**
     * The default uniform values for the batch shader.
     * @defaultValue `{}`
     */
    static defaultUniforms: AbstractBaseShader.Uniforms | BatchRenderer.BatchDefaultUniformsFunction;

    /**
     * The PackInterleavedGeometry function provided by the sampler.
     */
    protected _packInterleavedGeometry: BatchRenderer.PackInterleavedGeometryFunction | undefined;

    /**
     * The preRender function provided by the sampler and that is called just before a flush.
     */
    protected _preRenderBatch: BatchRenderer.PreRenderBatchFunction | undefined;

    get uniforms(): AbstractBaseShader.Uniforms | undefined;

    /**
     * The number of reserved texture units that the shader generator should not use (maximum 4).
     */
    protected set reservedTextureUnits(val: BatchRenderer.ReservedTextureUnits);

    /**
     * Number of reserved texture units reserved by the batch shader that cannot be used by the batch renderer.
     */
    get reservedTextureUnits(): BatchRenderer.ReservedTextureUnits;

    override setShaderGenerator(options?: InexactPartial<BatchRenderer.ShaderGeneratorOptions>): void;

    /**
     * This override allows to allocate a given number of texture units reserved for a custom batched shader.
     * These reserved texture units won't be used to batch textures for PIXI.Sprite or SpriteMesh.
     * @override
     */
    override contextChange(): void;

    override onPrerender(): void;

    override start(): void;

    override packInterleavedGeometry: BatchRenderer.PackInterleavedGeometryFunction;

    /**
     * Verify if a PIXI plugin exists. Check by name.
     * @param name - The name of the pixi plugin to check.
     * @returns True if the plugin exists, false otherwise.
     */
    static hasPlugin(name: string): boolean;
  }
}
