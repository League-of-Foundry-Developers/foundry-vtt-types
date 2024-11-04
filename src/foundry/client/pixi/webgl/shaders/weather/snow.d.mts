import type { InterfaceToObject } from "../../../../../../types/helperTypes.d.mts";

declare abstract class AnySnowShader extends SnowShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace SnowShader {
    type AnyConstructor = typeof AnySnowShader;

    interface DefaultUniforms extends AbstractBaseShader.Uniforms {
      direction: number;
    }
  }

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
}
