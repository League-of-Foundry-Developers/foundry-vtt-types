export {};

declare abstract class AnyVortexColorationShader extends VortexColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyVortexIlluminationShader extends VortexIlluminationShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace VortexColorationShader {
    type AnyConstructor = typeof AnyVortexColorationShader;
  }

  namespace VortexIlluminationShader {
    type AnyConstructor = typeof AnyVortexIlluminationShader;
  }

  /**
   * Vortex animation coloration shader
   */
  class VortexColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: AbstractBaseShader.FragmentShader;
  }

  /**
   * Vortex animation coloration shader
   */
  class VortexIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: AbstractBaseShader.FragmentShader;
  }
}
