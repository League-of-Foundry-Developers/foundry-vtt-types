export {};

declare abstract class AnyRevolvingColorationShader extends RevolvingColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace RevolvingColorationShader {
    type AnyConstructor = typeof AnyRevolvingColorationShader;
  }

  /**
   * Revolving animation coloration shader
   */
  class RevolvingColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: AbstractBaseShader.FragmentShader;

    /**
     * @defaultValue
     * ```js
     * {
     *   ...super.defaultUniforms,
     *   angle: 0,
     *   gradientFade: 0.15,
     *   beamLength: 1
     * }
     * ```
     */
    static defaultUniforms: AbstractBaseShader.Uniforms;
  }
}
