import type { Identity } from "../../../../../../utils/index.d.mts";

declare global {
  /**
   * Snow shader effect.
   */
  class SnowShader<
    DefaultUniforms extends SnowShader.DefaultUniforms = SnowShader.DefaultUniforms,
  > extends AbstractWeatherShader<DefaultUniforms> {
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
    interface Any extends AnySnowShader {}
    interface AnyConstructor extends Identity<typeof AnySnowShader> {}

    interface DefaultUniforms extends AbstractWeatherShader.DefaultUniforms {
      direction: number;
    }
  }
}

declare abstract class AnySnowShader extends SnowShader {
  constructor(arg0: never, ...args: never[]);
}
