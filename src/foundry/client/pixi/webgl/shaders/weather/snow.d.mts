import type { InterfaceToObject } from "../../../../../../utils/index.d.mts";

declare global {
  /**
   * Snow shader effect.
   */
  class SnowShader<
    DefaultUniforms extends SnowShader.DefaultUniforms = SnowShader.DefaultUniforms,
  > extends AbstractWeatherShader<InterfaceToObject<DefaultUniforms>> {
    /**
     * @defaultValue
     * ```
     * {
     *  direction: 1.2
     * }
     * ```
     */
    static override defaultUniforms: SnowShader.DefaultUniforms;

    static override fragmentShader: string;
  }

  namespace SnowShader {
    type Any = AnySnowShader;
    type AnyConstructor = typeof AnySnowShader;

    interface DefaultUniforms extends AbstractBaseShader.Uniforms {
      direction: number;
    }
  }
}

declare abstract class AnySnowShader extends SnowShader {
  constructor(arg0: never, ...args: never[]);
}
