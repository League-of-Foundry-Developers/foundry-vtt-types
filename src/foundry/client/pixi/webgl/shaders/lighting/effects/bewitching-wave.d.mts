export {};

declare global {
  /**
   * Bewitching Wave animation illumination shader
   */
  class BewitchingWaveIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;
  }

  namespace BewitchingWaveColorationShader {
    type Any = AnyBewitchingWaveColorationShader;
    type AnyConstructor = typeof AnyBewitchingWaveColorationShader;
  }

  /**
   * Bewitching Wave animation coloration shader
   */
  class BewitchingWaveColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: string;
  }

  namespace BewitchingWaveIlluminationShader {
    type Any = AnyBewitchingWaveIlluminationShader;
    type AnyConstructor = typeof AnyBewitchingWaveIlluminationShader;
  }
}

declare abstract class AnyBewitchingWaveColorationShader extends BewitchingWaveColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyBewitchingWaveIlluminationShader extends BewitchingWaveIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}
