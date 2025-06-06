import type { Identity } from "#utils";
import type AdaptiveIlluminationShader from "../illumination-lighting.mjs";
import type AdaptiveColorationShader from "../coloration-lighting.mjs";

/**
 * Wave animation illumination shader
 */
declare class WaveIlluminationShader extends AdaptiveIlluminationShader {
  static override fragmentShader: string;
}

declare namespace WaveIlluminationShader {
  interface Any extends AnyWaveIlluminationShader {}
  interface AnyConstructor extends Identity<typeof AnyWaveIlluminationShader> {}
}

/**
 * Wave animation coloration shader
 */
declare class WaveColorationShader extends AdaptiveColorationShader {
  static override fragmentShader: string;
}

declare namespace WaveColorationShader {
  interface Any extends AnyWaveColorationShader {}
  interface AnyConstructor extends Identity<typeof AnyWaveColorationShader> {}
}

export { WaveColorationShader, WaveIlluminationShader };

declare abstract class AnyWaveColorationShader extends WaveColorationShader {
  constructor(...args: never);
}

declare abstract class AnyWaveIlluminationShader extends WaveIlluminationShader {
  constructor(...args: never);
}
