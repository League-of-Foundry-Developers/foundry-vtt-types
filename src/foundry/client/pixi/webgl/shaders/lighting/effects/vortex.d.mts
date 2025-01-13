export {};

declare global {
  /**
   * Vortex animation coloration shader
   */
  class VortexColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string;
  }

  namespace VortexColorationShader {
    type Any = AnyVortexColorationShader;
    type AnyConstructor = typeof AnyVortexColorationShader;
  }

  /**
   * Vortex animation coloration shader
   */
  class VortexIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string;
  }

  namespace VortexIlluminationShader {
    type Any = AnyVortexIlluminationShader;
    type AnyConstructor = typeof AnyVortexIlluminationShader;
  }
}

declare abstract class AnyVortexColorationShader extends VortexColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyVortexIlluminationShader extends VortexIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}
