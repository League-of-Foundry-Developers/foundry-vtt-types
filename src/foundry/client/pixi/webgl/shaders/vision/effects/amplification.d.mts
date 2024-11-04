export {};

declare abstract class AnyAmplificationBackgroundVisionShader extends AmplificationBackgroundVisionShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace AmplificationBackgroundVisionShader {
    type AnyConstructor = typeof AnyAmplificationBackgroundVisionShader;
  }

  /**
   * Shader specialized in light amplification
   */
  class AmplificationBackgroundVisionShader extends BackgroundVisionShader {
    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *   ...super.defaultUniforms,
     *   colorTint: [0.38, 0.8, 0.38],
     *   brightness: 0.5
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    override get isRequired(): boolean;
  }
}
