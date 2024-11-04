import type { InexactPartial } from "../../../../../../types/utils.d.mts";

export {};

declare abstract class AnyWeatherShaderEffect extends WeatherShaderEffect {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace WeatherShaderEffect {
    type AnyConstructor = typeof AnyWeatherShaderEffect;

    type WeatherShaderEffectConfig = InexactPartial<AbstractBaseShader.Uniforms & WeatherShaderEffect["shader"]>;
  }

  /**
   * An interface for defining shader-based weather effects
   */
  class WeatherShaderEffect extends QuadMesh {
    /**
     * @param config - The config object to create the shader effect
     */
    constructor(config: WeatherShaderEffect.WeatherShaderEffectConfig, shaderClass: typeof AbstractBaseShader);

    /**
     * Set shader parameters.
     */
    configure(config?: WeatherShaderEffect.WeatherShaderEffectConfig): void;

    /**
     * Begin animation
     */
    play(): void;

    /**
     * Stop animation
     */
    stop(): void;

    /**
     * Initialize the weather effect.
     * @param config - Config object.
     */
    protected _initialize(config: WeatherShaderEffect.WeatherShaderEffectConfig): void;
  }
}
