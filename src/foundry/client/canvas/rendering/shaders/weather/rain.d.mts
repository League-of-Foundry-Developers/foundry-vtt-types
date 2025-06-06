import type { Identity } from "#utils";
import type AbstractWeatherShader from "./base-weather.mjs";

/**
 * Rain shader effect.
 */
declare class RainShader<
  DefaultUniforms extends RainShader.DefaultUniforms = RainShader.DefaultUniforms,
> extends AbstractWeatherShader<DefaultUniforms> {
  /**
   * @defaultValue
   * ```js
   * {
   *    opacity: 1,
   *    intensity: 1,
   *    strength: 1,
   *    rotation: 0.5,
   *    resolution: [3200, 80] // The resolution to have nice rain ropes with the voronoi cells
   * }
   * ```
   */
  static override defaultUniforms: RainShader.DefaultUniforms;

  static override fragmentShader: string;
}

declare namespace RainShader {
  interface Any extends AnyRainShader {}
  interface AnyConstructor extends Identity<typeof AnyRainShader> {}

  interface DefaultUniforms extends AbstractWeatherShader.DefaultUniforms {
    opacity: number;
    intensity: number;
    strength: number;
    rotation: number;
    resolution: [number, number];
  }
}

export default RainShader;

declare abstract class AnyRainShader extends RainShader {
  constructor(...args: never);
}
