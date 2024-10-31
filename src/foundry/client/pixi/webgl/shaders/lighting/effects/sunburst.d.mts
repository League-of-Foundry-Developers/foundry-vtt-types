export {};

declare abstract class AnySunburstColorationShader extends SunburstColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnySunburstIlluminationShader extends SunburstIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace SunburstColorationShader {
    type AnyConstructor = typeof AnySunburstColorationShader;
  }

  namespace SunburstIlluminationShader {
    type AnyConstructor = typeof AnySunburstIlluminationShader;
  }

  /**
   * Sunburst animation illumination shader
   */
  class SunburstIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: AbstractBaseShader.FragmentShader;
  }

  /**
   * Sunburst animation coloration shader
   */
  class SunburstColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: AbstractBaseShader.FragmentShader;
  }
}
