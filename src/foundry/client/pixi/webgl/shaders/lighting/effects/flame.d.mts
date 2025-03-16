import type { Identity } from "../../../../../../../utils/index.d.mts";

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
    interface AnyConstructor extends Identity<typeof AnyFlameIlluminationShader> {}
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
    interface AnyConstructor extends Identity<typeof AnyFlameColorationShader> {}
  }
}

declare abstract class AnyFlameIlluminationShader extends FlameIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyFlameColorationShader extends FlameColorationShader {
  constructor(arg0: never, ...args: never[]);
}
