import type { Identity } from "fvtt-types/utils";

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
    interface AnyConstructor extends Identity<typeof AnyFairyLightColorationShader> {}
  }

  /**
   * Fairy light animation illumination shader
   */
  class FairyLightIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;
  }

  namespace FairyLightIlluminationShader {
    interface Any extends AnyFairyLightIlluminationShader {}
    interface AnyConstructor extends Identity<typeof AnyFairyLightIlluminationShader> {}
  }
}

declare abstract class AnyFairyLightColorationShader extends FairyLightColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyFairyLightIlluminationShader extends FairyLightIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}
