import type { InterfaceToObject } from "../../../../../../types/helperTypes.d.mts";

export {};

declare abstract class AnyRainShader extends RainShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace RainShader {
    type AnyConstructor = typeof AnyRainShader;

    interface DefaultUniforms extends AbstractBaseShader.Uniforms {
      opacity: number;
      intensity: number;
      strength: number;
      rotation: number;
      resolution: [number, number];
    }
  }

  /**
   * Rain shader effect.
   */
  class RainShader<
    DefaultUniforms extends RainShader.DefaultUniforms = RainShader.DefaultUniforms,
  > extends AbstractWeatherShader<InterfaceToObject<DefaultUniforms>> {
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
}
