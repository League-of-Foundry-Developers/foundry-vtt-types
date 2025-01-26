import type { InexactPartial, FixedInstanceType } from "fvtt-types/utils";

declare abstract class AnyWeatherShaderEffect extends WeatherShaderEffect<any> {
  constructor(arg0: never, ...args: never[]);
}

type QuadMeshClass = typeof QuadMesh;

interface InternalWeatherShaderEffect_Interface extends QuadMeshClass {
  new <ShaderClassInstance extends object>(
    ...args: ConstructorParameters<typeof QuadMesh>
  ): QuadMesh & ShaderClassInstance;
}

declare const InternalWeatherShaderEffect_Const: InternalWeatherShaderEffect_Interface;

// @ts-expect-error - This pattern inherently requires a ts-expect-error as the base class is dynamic.
class InternalWeatherShaderEffect<
  ShaderClass extends AbstractBaseShader.AnyConstructor,
  _ShaderClassInstance extends object = FixedInstanceType<ShaderClass>,
> extends InternalWeatherShaderEffect_Const<_ShaderClassInstance> {}

declare global {
  namespace WeatherShaderEffect {
    type AnyConstructor = typeof AnyWeatherShaderEffect;

    type WeatherShaderEffectConfig = InexactPartial<AbstractBaseShader.Uniforms & WeatherShaderEffect["shader"]>;
  }

  /**
   * An interface for defining shader-based weather effects
   */
  class WeatherShaderEffect<
    ShaderClass extends AbstractWeatherShader.AnyConstructor = AbstractWeatherShader.AnyConstructor,
  > extends InternalWeatherShaderEffect<ShaderClass> {
    /**
     * @param config - The config object to create the shader effect
     */
    constructor(config: WeatherShaderEffect.WeatherShaderEffectConfig, shaderClass: ShaderClass);

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
