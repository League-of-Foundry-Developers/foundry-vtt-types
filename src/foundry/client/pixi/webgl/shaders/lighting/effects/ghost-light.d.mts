export {};

declare abstract class AnyGhostLightIlluminationShader extends GhostLightIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyGhostLightColorationShader extends GhostLightColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace GhostLightIlluminationShader {
    type AnyConstructor = typeof AnyGhostLightIlluminationShader;
  }

  namespace GhostLightColorationShader {
    type AnyConstructor = typeof AnyGhostLightColorationShader;
  }

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
