import type { Identity } from "fvtt-types/utils";

declare global {
  /**
   * Bewitching Wave animation illumination shader
   */
  class BewitchingWaveIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;
  }

  namespace BewitchingWaveColorationShader {
    interface Any extends AnyBewitchingWaveColorationShader {}
    interface AnyConstructor extends Identity<typeof AnyBewitchingWaveColorationShader> {}
  }

  /**
   * Bewitching Wave animation coloration shader
   */
  class BewitchingWaveColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: string;
  }

  namespace BewitchingWaveIlluminationShader {
    interface Any extends AnyBewitchingWaveIlluminationShader {}
    interface AnyConstructor extends Identity<typeof AnyBewitchingWaveIlluminationShader> {}
  }
}

declare abstract class AnyBewitchingWaveColorationShader extends BewitchingWaveColorationShader {
  constructor(...args: never);
}

declare abstract class AnyBewitchingWaveIlluminationShader extends BewitchingWaveIlluminationShader {
  constructor(...args: never);
}
