export {};

declare global {
  /**
   * Fairy light animation coloration shader
   */
  class FairyLightColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string;
  }

  namespace FairyLightColorationShader {
    interface Any extends AnyFairyLightColorationShader {}
    type AnyConstructor = typeof AnyFairyLightColorationShader;
  }

  /**
   * Fairy light animation illumination shader
   */
  class FairyLightIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;
  }

  namespace FairyLightIlluminationShader {
    interface Any extends AnyFairyLightColorationShader {}
    type AnyConstructor = typeof AnyFairyLightIlluminationShader;
  }
}

declare abstract class AnyFairyLightColorationShader extends FairyLightColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyFairyLightIlluminationShader extends FairyLightIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}
