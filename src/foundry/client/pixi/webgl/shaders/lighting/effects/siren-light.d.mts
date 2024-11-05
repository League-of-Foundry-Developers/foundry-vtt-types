export {};

declare abstract class AnySirenColorationShader extends SirenColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnySirenIlluminationShader extends SirenIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace SirenColorationShader {
    type AnyConstructor = typeof AnySirenColorationShader;
  }

  namespace SirenIlluminationShader {
    type AnyConstructor = typeof AnySirenIlluminationShader;
  }

  /**
   * Siren light animation coloration shader
   */
  class SirenColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *   ...super.defaultUniforms,
     *   ratio: 0,
     *   brightnessPulse: 1,
     *   angle: 0,
     *   gradientFade: 0.15,
     *   beamLength: 1
     * }
     * ```
     */
    static defaultUniforms: AbstractBaseShader.Uniforms;
  }

  /**
   * Siren light animation illumination shader
   */
  class SirenIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *   ...super.defaultUniforms,
     *   angle: 0,
     *   gradientFade: 0.45,
     *   beamLength: 1
     * }
     * ```
     */
    static defaultUniforms: AbstractBaseShader.Uniforms;
  }
}
