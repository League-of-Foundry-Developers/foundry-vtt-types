import type { ConstructorOf } from "../../../../../../types/utils.d.mts";

declare global {
  /**
   * A shader used to control channels intensity using an externally provided mask texture.
   */
  // @ts-expect-error Foundry overrode the fragmentShader string property with a method that returns a string
  class InverseOcclusionSamplerShader extends BaseSamplerShader {
    /**
     * @defaultValue `null`
     */
    static override classPluginName: string | null;

    /**
     * @defaultValue
     * ```js
     * {
     *    roof: false,
     *    vision: false,
     *    tintAlpha: [1, 1, 1, 1],
     *    depthElevation: 0,
     *    sampler: null,
     *    maskSampler: null,
     *    alpha: 1.0,
     *    alphaOcclusion: 1.0,
     *    screenDimensions: [1, 1],
     *    pixelRatio: [1, 1]
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    static override vertexShader: string;

    static override fragmentShader(sampleSize: number): string;

    /**
     * A factory method for creating the shader using its defined default values
     */
    static create<T extends InverseOcclusionSamplerShader>(
      this: ConstructorOf<T>,
      defaultUniforms?: AbstractBaseShader.Uniforms,
    ): T;

    protected override _preRender(mesh: SpriteMesh): void;
  }
}
