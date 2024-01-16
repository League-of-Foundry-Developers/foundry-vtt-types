export {};

declare global {
  /**
   * An occlusion shader to reveal certain area with elevation comparisons.
   * This shader is also working as a batched plugin.
   */
  class OcclusionSamplerShader extends BaseSamplerShader {
    /**
     * @defaultValue `"occlusion"`
     */
    static override classPluginName: string;

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

    /**
     * @defaultValue `7`
     */
    static override batchVertexSize: number;

    static initializeBatchGeometry(): void;

    protected static override _packInterleavedGeometry(
      element: PIXI.IBatchableElement,
      attributeBuffer: PIXI.ViewableBuffer,
      indexBuffer: Uint16Array,
      aIndex: number,
      iIndex: number,
    ): void;

    static override batchVertexShader: string;

    static override batchFragmentShader: string;

    static override vertexShader: string;

    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *    tintAlpha: [1, 1, 1, 1],
     *    sampler: null,
     *    occlusionTexture: null,
     *    occlusionMode: 0,
     *    screenDimensions: [1, 1]
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    protected override _preRender(mesh: SpriteMesh): void;
  }
}
