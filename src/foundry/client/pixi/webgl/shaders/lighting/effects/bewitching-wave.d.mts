export {};

declare abstract class AnyBewitchingWaveColorationShader extends BewitchingWaveColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyBewitchingWaveIlluminationShader extends BewitchingWaveIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace BewitchingWaveColorationShader {
    type AnyConstructor = typeof AnyBewitchingWaveColorationShader;
  }

  namespace BewitchingWaveIlluminationShader {
    type AnyConstructor = typeof AnyBewitchingWaveIlluminationShader;
  }

  /**
   * Bewitching Wave animation illumination shader
   */
  class BewitchingWaveIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;
  }

  /**
   * Bewitching Wave animation coloration shader
   */
  class BewitchingWaveColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: string;
  }
}
