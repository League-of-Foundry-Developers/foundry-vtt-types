import type { Identity } from "#utils";

declare global {
  /**
   * Radial rainbow animation coloration shader
   */
  class RadialRainbowColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string;
  }

  namespace RadialRainbowColorationShader {
    interface Any extends AnyRadialRainbowColorationShader {}
    interface AnyConstructor extends Identity<typeof AnyRadialRainbowColorationShader> {}
  }
}

declare abstract class AnyRadialRainbowColorationShader extends RadialRainbowColorationShader {
  constructor(...args: never);
}
