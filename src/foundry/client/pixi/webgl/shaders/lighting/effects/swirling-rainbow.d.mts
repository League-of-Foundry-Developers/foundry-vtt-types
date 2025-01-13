export {};
declare global {
  /**
   * Swirling rainbow animation coloration shader
   */
  class SwirlingRainbowColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string;
  }

  namespace SwirlingRainbowColorationShader {
    type Any = AnySwirlingRainbowColorationShader;
    type AnyConstructor = typeof AnySwirlingRainbowColorationShader;
  }
}

declare abstract class AnySwirlingRainbowColorationShader extends SwirlingRainbowColorationShader {
  constructor(arg0: never, ...args: never[]);
}
