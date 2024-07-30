export {};

declare global {
  /**
   * Ghost light animation illumination shader
   */
  class GhostLightIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: AbstractBaseShader.FragmentShader;
  }

  /**
   * Ghost light animation coloration shader
   */
  class GhostLightColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: AbstractBaseShader.FragmentShader;
  }
}
