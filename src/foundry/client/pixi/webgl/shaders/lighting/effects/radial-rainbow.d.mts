export {};

declare abstract class AnyRadialRainbowColorationShader extends RadialRainbowColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace RadialRainbowColorationShader {
    type AnyConstructor = typeof AnyRadialRainbowColorationShader;
  }

  /**
   * Radial rainbow animation coloration shader
   */
  class RadialRainbowColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: AbstractBaseShader.FragmentShader;
  }
}
