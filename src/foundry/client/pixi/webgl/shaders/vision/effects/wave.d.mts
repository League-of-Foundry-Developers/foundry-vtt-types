export {};

declare global {
  /**
   * Shader specialized in wave like senses (tremorsenses)
   */
  class WaveBackgroundVisionShader extends BackgroundVisionShader {
    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *   ...super.defaultUniforms,
     *   colorTint: [0.8, 0.1, 0.8]
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    override get isRequired(): boolean;
  }

  namespace WaveBackgroundVisionShader {
    type Any = AnyWaveBackgroundVisionShader;
    type AnyConstructor = typeof AnyWaveBackgroundVisionShader;
  }

  /**
   * The wave vision shader, used to create waves emanations (ex: tremorsense)
   */
  class WaveColorationVisionShader extends ColorationVisionShader {
    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *   ...super.defaultUniforms,
     *   colorEffect: [0.8, 0.1, 0.8]
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    override get isRequired(): boolean;
  }

  namespace WaveColorationVisionShader {
    type Any = AnyWaveColorationVisionShader;
    type AnyConstructor = typeof AnyWaveColorationVisionShader;
  }
}

declare abstract class AnyWaveBackgroundVisionShader extends WaveBackgroundVisionShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyWaveColorationVisionShader extends WaveColorationVisionShader {
  constructor(arg0: never, ...args: never[]);
}
