import type { Identity } from "#utils";
import type AdaptiveColorationShader from "../coloration-lighting.mjs";
import type AdaptiveIlluminationShader from "../illumination-lighting.mjs";

/**
 * Bewitching Wave animation illumination shader
 */
declare class BewitchingWaveIlluminationShader extends AdaptiveIlluminationShader {
  static override fragmentShader: string;
}

declare namespace BewitchingWaveColorationShader {
  interface Any extends AnyBewitchingWaveColorationShader {}
  interface AnyConstructor extends Identity<typeof AnyBewitchingWaveColorationShader> {}
}

/**
 * Bewitching Wave animation coloration shader
 */
declare class BewitchingWaveColorationShader extends AdaptiveColorationShader {
  static override fragmentShader: string;
}

declare namespace BewitchingWaveIlluminationShader {
  interface Any extends AnyBewitchingWaveIlluminationShader {}
  interface AnyConstructor extends Identity<typeof AnyBewitchingWaveIlluminationShader> {}
}

export { BewitchingWaveColorationShader, BewitchingWaveIlluminationShader };

declare abstract class AnyBewitchingWaveColorationShader extends BewitchingWaveColorationShader {
  constructor(...args: never);
}

declare abstract class AnyBewitchingWaveIlluminationShader extends BewitchingWaveIlluminationShader {
  constructor(...args: never);
}
