import type { Identity } from "#utils";
import type AbstractWeatherShader from "./base-weather.mjs";

/**
 * Fog shader effect.
 */
declare class FogShader<
  DefaultUniforms extends FogShader.DefaultUniforms = FogShader.DefaultUniforms,
> extends AbstractWeatherShader<DefaultUniforms> {
  /**
   * @defaultValue
   * ```js
   * {
   *    intensity: 1,
   *    rotation: 0,
   *    slope: 0.25
   * }
   * ```
   */
  static override defaultUniforms: FogShader.DefaultUniforms;

  /**
   * Configure the number of octaves into the shaders.
   */
  static OCTAVES(mode: number): string;

  /**
   * Configure the fog complexity according to mode (performance).
   */
  static FOG(mode: number): string;

  static override createProgram(): PIXI.Program;

  static override fragmentShader(mode: number): string;
}

declare namespace FogShader {
  interface Any extends AnyFogShader {}
  interface AnyConstructor extends Identity<typeof AnyFogShader> {}

  interface DefaultUniforms extends AbstractWeatherShader.DefaultUniforms {
    intensity: number;
    rotation: number;
    slope: number;
  }
}

export default FogShader;

declare abstract class AnyFogShader extends FogShader {
  constructor(...args: never);
}
