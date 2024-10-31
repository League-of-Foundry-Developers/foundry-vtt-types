export {};

declare abstract class AnySwirlingRainbowColorationShader extends SwirlingRainbowColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace SwirlingRainbowColorationShader {
    type AnyConstructor = typeof AnySwirlingRainbowColorationShader;
  }

  /**
   * Swirling rainbow animation coloration shader
   */
  class SwirlingRainbowColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: AbstractBaseShader.FragmentShader;
  }
}
