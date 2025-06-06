import type { Identity } from "#utils";
import type AdaptiveColorationShader from "../coloration-lighting.mjs";
import type AdaptiveIlluminationShader from "../illumination-lighting.mjs";

/**
 * Sunburst animation illumination shader
 */
declare class SunburstIlluminationShader extends AdaptiveIlluminationShader {
  static override fragmentShader: string;
}

declare namespace SunburstIlluminationShader {
  interface Any extends AnySunburstIlluminationShader {}
  interface AnyConstructor extends Identity<typeof AnySunburstIlluminationShader> {}
}

/**
 * Sunburst animation coloration shader
 */
declare class SunburstColorationShader extends AdaptiveColorationShader {
  static override fragmentShader: string;
}

declare namespace SunburstColorationShader {
  interface Any extends AnySunburstColorationShader {}
  interface AnyConstructor extends Identity<typeof AnySunburstColorationShader> {}
}

export { SunburstColorationShader, SunburstIlluminationShader };

declare abstract class AnySunburstColorationShader extends SunburstColorationShader {
  constructor(...args: never);
}

declare abstract class AnySunburstIlluminationShader extends SunburstIlluminationShader {
  constructor(...args: never);
}
