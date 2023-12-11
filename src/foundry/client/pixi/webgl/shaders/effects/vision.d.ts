export {};

declare global {
  /**
   * This class defines an interface which all adaptive vision shaders extend.
   */
  class AdaptiveVisionShader extends AdaptiveLightingShader {}

  /**
   * The default background shader used for vision sources
   */
  class BackgroundVisionShader extends AdaptiveVisionShader {}

  /**
   * The default illumination shader used for vision sources
   */
  class IlluminationVisionShader extends AdaptiveVisionShader {}

  /**
   * The default coloration shader used for vision sources.
   */
  class ColorationVisionShader extends AdaptiveVisionShader {}

  /**
   * Shader specialized in wave like senses (tremorsenses)
   */
  class WaveBackgroundVisionShader extends BackgroundVisionShader {}

  /**
   * The wave vision shader, used to create waves emanations (ex: tremorsense)
   */
  class WaveColorationVisionShader extends ColorationVisionShader {}

  /**
   * Shader specialized in light amplification
   */
  class AmplificationBackgroundVisionShader extends BackgroundVisionShader {}
}
