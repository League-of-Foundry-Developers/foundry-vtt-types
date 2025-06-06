import type { Identity } from "#utils";
import type AbstractWeatherShader from "./base-weather.mjs";

/**
 * Snow shader effect.
 */
declare class SnowShader<
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

declare namespace SnowShader {
  interface Any extends AnySnowShader {}
  interface AnyConstructor extends Identity<typeof AnySnowShader> {}

  interface DefaultUniforms extends AbstractWeatherShader.DefaultUniforms {
    direction: number;
  }
}

export default SnowShader;

declare abstract class AnySnowShader extends SnowShader {
  constructor(...args: never);
}
