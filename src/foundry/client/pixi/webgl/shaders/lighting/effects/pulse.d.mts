import type { Identity } from "../../../../../../../utils/index.d.mts";

declare global {
  /**
   * Pulse animation illumination shader
   */
  class PulseIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;
  }

  namespace PulseIlluminationShader {
    interface Any extends AnyPulseIlluminationShader {}
    interface AnyConstructor extends Identity<typeof AnyPulseIlluminationShader> {}
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
    interface AnyConstructor extends Identity<typeof AnyPulseColorationShader> {}
  }
}

declare abstract class AnyPulseColorationShader extends PulseColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyPulseIlluminationShader extends PulseIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}
