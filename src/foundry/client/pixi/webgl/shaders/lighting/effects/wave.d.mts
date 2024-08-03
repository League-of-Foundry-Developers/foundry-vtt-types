export {};

declare global {
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
