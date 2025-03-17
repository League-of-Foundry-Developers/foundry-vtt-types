import type { Identity, IntentionalPartial } from "fvtt-types/utils";

declare global {
  /**
   * An interface for defining shader-based weather effects
   */
  class WeatherShaderEffect extends QuadMesh {
    /**
     * @param config - The config object to create the shader effect
     */
    constructor(
      config: WeatherShaderEffect.Configuration | undefined,
      shaderClass: AbstractWeatherShader.AnyConstructor,
    );

    /** @privateRemarks Override not in Foundry code, but reflects reality at runtime */
    override get shader(): AbstractWeatherShader;

    /** @privateRemarks Override not in Foundry code, but reflects reality at runtime */
    override setShaderClass(shaderClass: AbstractWeatherShader.AnyConstructor): void;

    /**
     * Set shader parameters.
     */
    configure(
      config?: WeatherShaderEffect.Configuration, // not:null (gets `Object.entries()`ed)
    ): void;

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
    protected _initialize(config: WeatherShaderEffect.Configuration): void;
  }

  namespace WeatherShaderEffect {
    interface Any extends AnyWeatherShaderEffect {}
    interface AnyConstructor extends Identity<typeof AnyWeatherShaderEffect> {}

    type Configuration = IntentionalPartial<AbstractBaseShader.Uniforms & AbstractWeatherShader>;
  }
}

declare abstract class AnyWeatherShaderEffect extends WeatherShaderEffect {
  constructor(arg0: never, ...args: never[]);
}
