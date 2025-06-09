import type { Identity } from "#utils";
import type AdaptiveColorationShader from "../coloration-lighting.mjs";
import type AdaptiveIlluminationShader from "../illumination-lighting.mjs";

/**
 * Fairy light animation coloration shader
 */
declare class FairyLightColorationShader extends AdaptiveColorationShader {
  /**
   * @defaultValue `true`
   */
  static override forceDefaultColor: boolean;

  static override fragmentShader: string;
}

declare namespace FairyLightColorationShader {
  interface Any extends AnyFairyLightColorationShader {}
  interface AnyConstructor extends Identity<typeof AnyFairyLightColorationShader> {}
}

/**
 * Fairy light animation illumination shader
 */
declare class FairyLightIlluminationShader extends AdaptiveIlluminationShader {
  static override fragmentShader: string;
}

declare namespace FairyLightIlluminationShader {
  interface Any extends AnyFairyLightIlluminationShader {}
  interface AnyConstructor extends Identity<typeof AnyFairyLightIlluminationShader> {}
}

export { FairyLightColorationShader, FairyLightIlluminationShader };

declare abstract class AnyFairyLightColorationShader extends FairyLightColorationShader {
  constructor(...args: never);
}

declare abstract class AnyFairyLightIlluminationShader extends FairyLightIlluminationShader {
  constructor(...args: never);
}
