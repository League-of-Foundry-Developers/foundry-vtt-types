export {};

declare global {
  /**
   * Sunburst animation illumination shader
   */
  class SunburstIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;
  }

  namespace SunburstIlluminationShader {
    type Any = AnySunburstIlluminationShader;
    type AnyConstructor = typeof AnySunburstIlluminationShader;
  }

  /**
   * Sunburst animation coloration shader
   */
  class SunburstColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: string;
  }

  namespace SunburstColorationShader {
    type Any = AnySunburstColorationShader;
    type AnyConstructor = typeof AnySunburstColorationShader;
  }
}

declare abstract class AnySunburstColorationShader extends SunburstColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnySunburstIlluminationShader extends SunburstIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}
