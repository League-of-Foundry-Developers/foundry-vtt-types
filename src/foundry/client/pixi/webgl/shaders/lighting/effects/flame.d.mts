export {};

declare global {
  /**
   * Alternative torch illumination shader
   */
  class FlameIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;

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

  namespace FlameIlluminationShader {
    interface Any extends AnyFlameIlluminationShader {}
    type AnyConstructor = typeof AnyFlameIlluminationShader;
  }

  /**
   * Alternative torch coloration shader
   */
  class FlameColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: string;

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

  namespace FlameColorationShader {
    interface Any extends AnyFlameColorationShader {}
    type AnyConstructor = typeof AnyFlameColorationShader;
  }
}

declare abstract class AnyFlameIlluminationShader extends FlameIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyFlameColorationShader extends FlameColorationShader {
  constructor(arg0: never, ...args: never[]);
}
