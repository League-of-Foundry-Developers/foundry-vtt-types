export {};

declare abstract class AnyFogColorationShader extends FogColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace FogColorationShader {
    type AnyConstructor = typeof AnyFogColorationShader;
  }

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
}
