import type { ConstructorOf } from "../../../../../../types/utils.d.mts";

export {};

declare global {
  /**
   * A simple shader to emulate a PIXI.Sprite with a PIXI.Mesh (but faster!)
   */
  class BaseSamplerShader extends AbstractBaseShader {
    static override create<T extends BaseSamplerShader>(
      this: ConstructorOf<T>,
      defaultUniforms?: AbstractBaseShader.Uniforms | undefined,
    ): T;

    /**
     * The plugin name associated for this instance.
     */
    pluginName: (typeof BaseSamplerShader)["classPluginName"];

    /**
     * The named batch sampler plugin that is used by this shader, or null if no batching is used.
     * @defaultValue `"batch"`
     */
    static classPluginName: string | null;

    /**
     * Activate or deactivate this sampler. If set to false, the batch rendering is redirected to "batch".
     * Otherwise, the batch rendering is directed toward the instance pluginName (might be null)
     * @defaultValue `true`
     */
    get enabled(): boolean;

    set enabled(enabled);

    /**
     * Contrast adjustment
     * @defaultValue
     * ```js
     * `// Computing contrasted color
     * if ( contrast != 0.0 ) {
     * changedColor = (changedColor - 0.5) * (contrast + 1.0) + 0.5;
     * }`
     * ```
     */
    static CONTRAST: string;

    /**
     * Saturation adjustment
     * @defaultValue
     * ```js
     * `// Computing saturated color
     * if ( saturation != 0.0 ) {
     *  vec3 grey = vec3(perceivedBrightness(changedColor));
     *  changedColor = mix(grey, changedColor, 1.0 + saturation);
     * }`
     * ```
     */
    static SATURATION: string;

    /**
     * Exposure adjustment.
     * @defaultValue
     * ```js
     * `if ( exposure != 0.0 ) {
     *   changedColor *= (1.0 + exposure);
     * }`
     * ```
     */
    static EXPOSURE: string;

    /**
     * The adjustments made into fragment shaders.
     * @defaultValue
     * ```js
     * `vec3 changedColor = baseColor.rgb;
     * ${this.CONTRAST}
     * ${this.SATURATION}
     * ${this.EXPOSURE}
     * baseColor.rgb = changedColor;`
     * ```
     */
    static get ADJUSTMENTS(): string;

    /**
       * @defaultValue
       * ```js
       * `precision ${PIXI.settings.PRECISION_VERTEX} float;
       * attribute vec2 aVertexPosition;
       * attribute vec2 aTextureCoord;
       * uniform mat3 projectionMatrix;
       * varying vec2 vUvs;

       * void main() {
       *   vUvs = aTextureCoord;
       *   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
       * }`
       * ```
       */
    static override vertexShader: string;

    static override fragmentShader: string;

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
     * ```javascript
     * {
     *  tintAlpha: [1, 1, 1, 1],
     *  sampler: 0
     * };
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * Batch geometry associated with this sampler.
     */
    static batchGeometry: typeof PIXI.BatchGeometry;

    /**
     * The size of a vertice with all its packed attributes.
     * @defaultValue `6`
     */
    static batchVertexSize: number;

    /**
     * Pack interleaved geometry custom function.
     */
    protected static _packInterleavedGeometry: (
      element: PIXI.IBatchableElement,
      attributeBuffer: PIXI.ViewableBuffer,
      indexBuffer: Uint16Array,
      aIndex: number,
      iIndex: number,
    ) => void | undefined;

    /**
     * A prerender function happening just before the batch renderer is flushed.
     */
    protected static _preRenderBatch(): (batchRenderer: typeof BatchRenderer) => void;

    /**
     * A function that returns default uniforms associated with the batched version of this sampler.
     * @remarks Foundry annotated this as abstract
     */
    static batchDefaultUniforms:
      | ((maxTextures: AbstractBaseShader.UniformValue) => AbstractBaseShader.Uniforms)
      | undefined;

    /**
     * The number of reserved texture units for this shader that cannot be used by the batch renderer.
     * @defaultValue `0`
     */
    static reservedTextureUnits: number;

    /**
     * Initialize the batch geometry with custom properties.
     * @remarks Foundry annotated this as abstract
     */
    static initializeBatchGeometry(): void;

    /**
     * The batch renderer to use.
     */
    static batchRendererClass: typeof BatchRenderer;

    /**
     * The batch generator to use.
     */
    static batchShaderGeneratorClass: typeof BatchShaderGenerator;
    /**
     * Create a batch plugin for this sampler class.
     * @returns - The batch plugin class linked to this sampler class.
     */
    static createPlugin<T extends typeof BaseSamplerShader, BatchPlugin extends T["batchRendererClass"]>(
      this: ConstructorOf<T>,
    ): BatchPlugin;

    /**
     * Register the plugin for this sampler.
     */
    static registerPlugin(): void;

    /**
     * Perform operations which are required before binding the Shader to the Renderer.
     * @param mesh - The mesh linked to this shader.
     * @internal
     */
    protected _preRender(mesh: SpriteMesh): void;
  }
}
