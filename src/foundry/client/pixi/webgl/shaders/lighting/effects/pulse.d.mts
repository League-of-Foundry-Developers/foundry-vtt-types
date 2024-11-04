export {};

declare abstract class AnyPulseColorationShader extends PulseColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyPulseIlluminationShader extends PulseIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace PulseColorationShader {
    type AnyConstructor = typeof AnyPulseColorationShader;
  }

  namespace PulseIlluminationShader {
    type AnyConstructor = typeof AnyPulseIlluminationShader;
  }

  /**
   * Pulse animation illumination shader
   */
  class PulseIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;
  }

  /**
   * Pulse animation coloration shader
   */
  class PulseColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *   ...super.defaultUniforms,
     *   pulse: 0
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;
  }
}
