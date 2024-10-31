export {};

declare abstract class AnyWaveColorationShader extends WaveColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyWaveIlluminationShader extends WaveIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace WaveColorationShader {
    type AnyConstructor = typeof AnyWaveColorationShader;
  }

  namespace WaveIlluminationShader {
    type AnyConstructor = typeof AnyWaveIlluminationShader;
  }

  /**
   * Wave animation illumination shader
   */
  class WaveIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: AbstractBaseShader.FragmentShader;
  }

  /**
   * Wave animation coloration shader
   */
  class WaveColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: AbstractBaseShader.FragmentShader;
  }
}
