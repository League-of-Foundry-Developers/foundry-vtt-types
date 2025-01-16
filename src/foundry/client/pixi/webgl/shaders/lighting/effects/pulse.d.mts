export {};

declare global {
  /**
   * Pulse animation illumination shader
   */
  class PulseIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;
  }

  namespace PulseIlluminationShader {
    interface Any extends AnyPulseIlluminationShader {}
    type AnyConstructor = typeof AnyPulseIlluminationShader;
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

  namespace PulseColorationShader {
    interface Any extends AnyPulseColorationShader {}
    type AnyConstructor = typeof AnyPulseColorationShader;
  }
}

declare abstract class AnyPulseColorationShader extends PulseColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyPulseIlluminationShader extends PulseIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}
