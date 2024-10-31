export {};

declare abstract class AnyFairyLightColorationShader extends FairyLightColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyFairyLightIlluminationShader extends FairyLightIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace FairyLightColorationShader {
    type AnyConstructor = typeof AnyFairyLightColorationShader;
  }

  namespace FairyLightIlluminationShader {
    type AnyConstructor = typeof AnyFairyLightIlluminationShader;
  }

  /**
   * Fairy light animation coloration shader
   */
  class FairyLightColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: AbstractBaseShader.FragmentShader;
  }

  /**
   * Fairy light animation illumination shader
   */
  class FairyLightIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: AbstractBaseShader.FragmentShader;
  }
}
