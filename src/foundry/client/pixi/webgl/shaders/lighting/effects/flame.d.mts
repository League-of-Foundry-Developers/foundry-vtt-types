export {};

declare abstract class AnyFlameIlluminationShader extends FlameIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyFlameColorationShader extends FlameColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace FlameIlluminationShader {
    type AnyConstructor = typeof AnyFlameIlluminationShader;
  }

  namespace FlameColorationShader {
    type AnyConstructor = typeof AnyFlameColorationShader;
  }

  /**
   * Alternative torch illumination shader
   */
  class FlameIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: AbstractBaseShader.FragmentShader;

    /**
     * @defaultValue
     * ```js
     * {
     *   ...super.defaultUniforms,
     *   brightnessPulse: 1
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;
  }

  /**
   * Alternative torch coloration shader
   */
  class FlameColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: AbstractBaseShader.FragmentShader;

    /**
     * @defaultValue
     * ```js
     * {
     *   ...super.defaultUniforms,
     *   brightnessPulse: 1
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;
  }
}
