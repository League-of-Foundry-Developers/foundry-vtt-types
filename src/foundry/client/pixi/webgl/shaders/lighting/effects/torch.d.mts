export {};

declare abstract class AnyTorchColorationShader extends TorchColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyTorchIlluminationShader extends TorchIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace TorchColorationShader {
    type AnyConstructor = typeof AnyTorchColorationShader;
  }

  namespace TorchIlluminationShader {
    type AnyConstructor = typeof AnyTorchIlluminationShader;
  }

  /**
   * Allow coloring of illumination
   */
  class TorchIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;
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
}
