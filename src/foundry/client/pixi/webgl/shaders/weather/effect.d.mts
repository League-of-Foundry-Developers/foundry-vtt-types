import type { InexactPartial, FixedInstanceType } from "../../../../../../utils/index.d.mts";

type QuadMeshClass = typeof QuadMesh;

interface InternalWeatherShaderEffect_Interface extends QuadMeshClass {
  new <ShaderClassInstance extends object>(
    ...args: ConstructorParameters<typeof QuadMesh>
  ): QuadMesh & ShaderClassInstance;
}

declare const InternalWeatherShaderEffect_Const: InternalWeatherShaderEffect_Interface;

// @ts-expect-error - This pattern inherently requires a ts-expect-error as the base class is dynamic.
class InternalWeatherShaderEffect<
  ShaderClass extends AbstractWeatherShader.AnyConstructor,
  _ShaderClassInstance extends object = FixedInstanceType<ShaderClass>,
> extends InternalWeatherShaderEffect_Const<_ShaderClassInstance> {}

declare global {
  /**
   * An interface for defining shader-based weather effects
   */
  class WeatherShaderEffect<
    ShaderClass extends AbstractWeatherShader.AnyConstructor = AbstractWeatherShader.AnyConstructor,
  > extends InternalWeatherShaderEffect<ShaderClass> {
    /**
     * @param config - The config object to create the shader effect
     */
    constructor(config: WeatherShaderEffect.WeatherShaderEffectConfig | undefined, shaderClass: ShaderClass);

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
    type Any = AnyWeatherShaderEffect;
    type AnyConstructor = typeof AnyWeatherShaderEffect;

    type WeatherShaderEffectConfig = InexactPartial<AbstractBaseShader.Uniforms & WeatherShaderEffect["shader"]>;
  }
}

declare abstract class AnyWeatherShaderEffect extends WeatherShaderEffect<AbstractWeatherShader.AnyConstructor> {
  constructor(arg0: never, ...args: never[]);
}
