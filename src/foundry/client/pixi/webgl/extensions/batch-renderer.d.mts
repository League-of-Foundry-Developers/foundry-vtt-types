import type { ToMethod, InexactPartial } from "../../../../../utils/index.d.mts";

declare global {
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

    override setShaderGenerator(options?: BatchRenderer.ShaderGeneratorOptions): void;

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

  namespace BatchRenderer {
    type AnyConstructor = typeof AnyBatchRenderer;

    type PackInterleavedGeometryFunction = ToMethod<
      (
        element: PIXI.IBatchableElement,
        attributeBuffer: PIXI.ViewableBuffer,
        indexBuffer: Uint16Array,
        aIndex: number,
        iIndex: number,
      ) => void
    >;

    type PreRenderBatchFunction = ToMethod<(batchRenderer: typeof BatchRenderer) => void>;

    type BatchDefaultUniformsFunction = ToMethod<(maxTextures: number) => AbstractBaseShader.Uniforms>;

    type ReservedTextureUnits = 0 | 1 | 2 | 3 | 4;

    /** @internal */
    type _ShaderGeneratorOptions = InexactPartial<{
      /**
       * The vertex shader source
       * @remarks Can't be null as only a signature default is provided
       */
      vertex: typeof BatchRenderer.defaultVertexSrc;

      /**
       * The fragment shader source template
       * @remarks Can't be null as only a signature default is provided
       */
      fragment: typeof BatchRenderer.defaultFragmentTemplate;

      /**
       * Additional Uniforms
       * @remarks Can't be null as only a signature default is provided
       */
      uniforms: typeof BatchRenderer.defaultUniforms;
    }>;

    /**
     * Options for {@link BatchRenderer#setShaderGenerator} (and ultimately the
     * constructor of whatever's set as {@link BatchRenderer.shaderGeneratorClass})
     */
    interface ShaderGeneratorOptions extends _ShaderGeneratorOptions {}
  }
}

declare abstract class AnyBatchRenderer extends BatchRenderer {
  constructor(arg0: never, ...args: never[]);
}
