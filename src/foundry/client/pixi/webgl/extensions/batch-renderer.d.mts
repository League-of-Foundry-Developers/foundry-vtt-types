import type { ToMethod, InexactPartial, IntentionalPartial } from "fvtt-types/utils";
import type { IBatchableElement, ViewableBuffer } from "pixi.js";

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

    override setShaderGenerator(options?: InexactPartial<BatchRenderer.ShaderGeneratorOptions>): void;

    /**
     * This override allows to allocate a given number of texture units reserved for a custom batched shader.
     * These reserved texture units won't be used to batch textures for PIXI.Sprite or SpriteMesh.
     * @override
     */
    override contextChange(): void;

    override onPrerender(): void;

    override start(): void;

    /**
     * @privateRemarks This signature must match `PIXI.BatchRenderer#packInterleavedGeometry`, as opposed to being
     * a `PackInterleavedGeometryFunction`, as these params will be piped there if the subclass in question
     * doesn't implement `_packInterleavedGeometry`
     */
    override packInterleavedGeometry(
      element: IBatchableElement,
      attributeBuffer: ViewableBuffer,
      indexBuffer: Uint16Array,
      aIndex: number,
      iIndex: number,
    ): void;

    /**
     * Verify if a PIXI plugin exists. Check by name.
     * @param name - The name of the pixi plugin to check.
     * @returns True if the plugin exists, false otherwise.
     */
    static hasPlugin(name: string): boolean;
  }

  namespace BatchRenderer {
    interface Any extends AnyBatchRenderer {}
    type AnyConstructor = typeof AnyBatchRenderer;

    type PackInterleavedGeometryFunction = ToMethod<
      (
        /**
         * @privateRemarks The `element` param is `Partial`'d here because at least one `_packInterleavedGeometry` implementation (`DepthSampleShader`'s)
         * omits properties from the parent PIXI interface. Neither `PIXI.BatchRenderer` nor any Foundry implementations provide any default vaules for
         * properties of this interface, so no `InexactPartial` or `NullishProps`.
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
}

declare abstract class AnyBatchRenderer extends BatchRenderer {
  constructor(arg0: never, ...args: never[]);
}
