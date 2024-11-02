import type { EmptyObject, InexactPartial, Mixin } from "../../../../../../types/utils.d.mts";

export {};

declare abstract class AnyBaseSamplerShader extends BaseSamplerShader {
  constructor(arg0: never, ...args: never[]);
}

declare class BatchPlugin<BaseSamplerShaderClass extends BaseSamplerShader.AnyConstructor> {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  geometryClass: BaseSamplerShader.ToGeometryClass<BaseSamplerShaderClass["batchGeometry"]>;

  static get defaultVertexSrc(): (typeof BaseSamplerShaderClass)["batchVertexShader"];
}

declare class BatchGeometry extends PIXI.Geometry {
  constructor(_static?: boolean);
}

declare global {
  namespace BaseSamplerShader {
    type AnyConstructor = typeof AnyBaseSamplerShader;

    type PluginName = (typeof BaseSamplerShader)["classPluginName"];

    interface BatchGeometry {
      id: string;
      size: number;
      normalized: boolean;
      type: PIXI.TYPES;
    }

    type ToGeometryClass<G extends PIXI.BatchGeometry.AnyConstructor | BaseSamplerShader.BatchGeometry[]> =
      G extends readonly unknown[] ? typeof BatchGeometry : G;
  }

  /**
   * A simple shader to emulate a PIXI.Sprite with a PIXI.Mesh (but faster!)
   */
  class BaseSamplerShader extends AbstractBaseShader {
    /**
     * The named batch sampler plugin that is used by this shader, or null if no batching is used.
     * @defaultValue `"batch"`
     */
    static classPluginName: string | null;

    /**
     * Is this shader pausable or not?
     * @defaultValue `true`
     */
    static pausable: boolean;

    /**
     * The plugin name associated for this instance, if any.
     * Returns "batch" if the shader is disabled.
     */
    get pluginName(): BaseSamplerShader.PluginName;

    /**
     * Activate or deactivate this sampler. If set to false, the batch rendering is redirected to "batch".
     * Otherwise, the batch rendering is directed toward the instance pluginName (might be null)
     * @defaultValue `true`
     */
    get enabled(): boolean;

    set enabled(enabled: boolean);

    /**
     * Pause or Unpause this sampler. If set to true, the shader is disabled. Otherwise, it is enabled.
     * Contrary to enabled, a shader might decide to refuse a pause, to continue to render animations per example.
     * @see enabled
     */
    get paused(): boolean;

    set paused(paused: boolean);

    /**
     * Contrast adjustment
     */
    static CONTRAST: string;

    /**
     * Saturation adjustment
     */
    static SATURATION: string;

    /**
     * Exposure adjustment.
     */
    static EXPOSURE: string;

    /**
     * The adjustments made into fragment shaders.
     */
    static get ADJUSTMENTS(): string;

    static override vertexShader: string;

    static override fragmentShader: AbstractBaseShader.FragmentShader;

    /**
     * Batch default vertex
     */
    static batchVertexShader: string;

    /**
     * Batch default fragment
     */
    static batchFragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *   sampler: 0,
     *   tintAlpha: [1, 1, 1, 1]
     * };
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * Batch geometry associated with this sampler.
     * @defaultValue `PIXI.BatchGeometry`
     */
    static batchGeometry: BaseSamplerShader.BatchGeometry;

    /**
     * The size of a vertice with all its packed attributes.
     * @defaultValue `6`
     */
    static batchVertexSize: number;

    /**
     * Pack interleaved geometry custom function.
     */
    protected static _packInterleavedGeometry: BatchRenderer.PackInterleavedGeometryFunction | undefined;

    /**
     * A prerender function happening just before the batch renderer is flushed.
     */
    protected static _preRenderBatch: BatchRenderer.PreRenderBatchFunction | undefined;

    /**
     * A function that returns default uniforms associated with the batched version of this sampler.
     * @defaultValue `{}`
     */
    static batchDefaultUniforms: BatchRenderer.BatchDefaultUniformsFunction | EmptyObject;

    /**
     * The number of reserved texture units for this shader that cannot be used by the batch renderer.
     * @defaultValue `0`
     */
    static reservedTextureUnits: number;

    /**
     * Initialize the batch geometry with custom properties.
     */
    static initializeBatchGeometry(): void;

    /**
     * The batch renderer to use.
     * @defaultValue `BatchRenderer`
     */
    static batchRendererClass: typeof BatchRenderer;

    /**
     * The batch generator to use.
     * @defaultValue `BatchShaderGenerator`
     */
    static batchShaderGeneratorClass: typeof BatchShaderGenerator;

    /**
     * Create a batch plugin for this sampler class.
     * @returns - The batch plugin class linked to this sampler class.
     */
    static createPlugin<ThisType extends BaseSamplerShader.AnyConstructor>(
      this: ThisType,
    ): Mixin<typeof BatchPlugin<ThisType>, ThisType["batchRendererClass"]>;
    // static createPlugin<T extends typeof BaseSamplerShader, BatchPlugin extends T["batchRendererClass"]>(
    //   this: ConstructorOf<T>,
    // ): BatchPlugin;

    /**
     * Register the plugin for this sampler.
     */
    static registerPlugin(
      options?: InexactPartial<{
        /**
         * Override the plugin of the same name that is already registered?
         * @defaultValue `false`
         */
        force: boolean;
      }>,
    ): void;

    protected override _preRender(mesh: PIXI.DisplayObject, renderer: PIXI.Renderer): void;
  }
}