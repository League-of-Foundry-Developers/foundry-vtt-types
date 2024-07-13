import type { InexactPartial } from "../../../../../../types/utils.d.mts";

declare global {
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

  namespace WeatherShaderEffect {
    type WeatherShaderEffectConfig = InexactPartial<AbstractBaseShader.Uniforms & WeatherShaderEffect["shader"]>;
  }
}
