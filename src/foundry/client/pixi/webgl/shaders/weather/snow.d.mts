export {};

declare abstract class AnySnowShader extends SnowShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace SnowShader {
    type AnyConstructor = typeof AnySnowShader;
  }

  /**
   * Snow shader effect.
   */
  class SnowShader extends AbstractWeatherShader {
    /**
     * @defaultValue
     * ```
     * {
     *  direction: 1.2
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    static override fragmentShader: string;
  }
}
