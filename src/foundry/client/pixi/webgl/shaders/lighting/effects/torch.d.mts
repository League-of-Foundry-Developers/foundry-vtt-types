export {};

declare global {
  /**
   * Allow coloring of illumination
   */
  class TorchIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;
  }

  namespace TorchIlluminationShader {
    type Any = AnyTorchIlluminationShader;
    type AnyConstructor = typeof AnyTorchIlluminationShader;
  }

  /**
   * Torch animation coloration shader
   */
  class TorchColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *   ...super.defaultUniforms,
     *   ratio: 0,
     *   brightnessPulse: 1
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;
  }

  namespace TorchColorationShader {
    type Any = AnyTorchColorationShader;
    type AnyConstructor = typeof AnyTorchColorationShader;
  }
}

declare abstract class AnyTorchColorationShader extends TorchColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyTorchIlluminationShader extends TorchIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}
