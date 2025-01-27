export {};

declare global {
  /**
   * Ghost light animation illumination shader
   */
  class GhostLightIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;
  }

  namespace GhostLightIlluminationShader {
    interface Any extends AnyGhostLightIlluminationShader {}
    type AnyConstructor = typeof AnyGhostLightIlluminationShader;
  }

  /**
   * Ghost light animation coloration shader
   */
  class GhostLightColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: string;
  }

  namespace GhostLightColorationShader {
    interface Any extends AnyGhostLightColorationShader {}
    type AnyConstructor = typeof AnyGhostLightColorationShader;
  }
}

declare abstract class AnyGhostLightIlluminationShader extends GhostLightIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyGhostLightColorationShader extends GhostLightColorationShader {
  constructor(arg0: never, ...args: never[]);
}
