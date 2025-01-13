export {};

declare global {
  /**
   * Fog animation coloration shader
   */
  class FogColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string;
  }

  namespace FogColorationShader {
    type Any = AnyFogColorationShader;
    type AnyConstructor = typeof AnyFogColorationShader;
  }
}

declare abstract class AnyFogColorationShader extends FogColorationShader {
  constructor(arg0: never, ...args: never[]);
}
