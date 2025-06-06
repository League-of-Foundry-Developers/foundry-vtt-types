import type { Identity } from "#utils";
import type AdaptiveColorationShader from "../coloration-lighting.mjs";
import type AdaptiveIlluminationShader from "../illumination-lighting.mjs";

/**
 * Vortex animation coloration shader
 */
declare class VortexColorationShader extends AdaptiveColorationShader {
  /**
   * @defaultValue `true`
   */
  static override forceDefaultColor: boolean;

  static override fragmentShader: string;
}

declare namespace VortexColorationShader {
  interface Any extends AnyVortexColorationShader {}
  interface AnyConstructor extends Identity<typeof AnyVortexColorationShader> {}
}

/**
 * Vortex animation coloration shader
 */
declare class VortexIlluminationShader extends AdaptiveIlluminationShader {
  static override fragmentShader: string;
}

declare namespace VortexIlluminationShader {
  interface Any extends AnyVortexIlluminationShader {}
  interface AnyConstructor extends Identity<typeof AnyVortexIlluminationShader> {}
}

export { VortexColorationShader, VortexIlluminationShader };

declare abstract class AnyVortexColorationShader extends VortexColorationShader {
  constructor(...args: never);
}

declare abstract class AnyVortexIlluminationShader extends VortexIlluminationShader {
  constructor(...args: never);
}
