export {};

declare global {
  /**
   * Wave animation illumination shader
   */
  class WaveIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;
  }

  namespace WaveIlluminationShader {
    interface Any extends AnyWaveIlluminationShader {}
    type AnyConstructor = typeof AnyWaveIlluminationShader;
  }

  /**
   * Wave animation coloration shader
   */
  class WaveColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: string;
  }

  namespace WaveColorationShader {
    interface Any extends AnyWaveColorationShader {}
    type AnyConstructor = typeof AnyWaveColorationShader;
  }
}

declare abstract class AnyWaveColorationShader extends WaveColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyWaveIlluminationShader extends WaveIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}
