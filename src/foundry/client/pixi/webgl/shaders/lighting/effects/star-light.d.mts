export {};

declare abstract class AnyStarLightColorationShader extends StarLightColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace StarLightColorationShader {
    type AnyConstructor = typeof AnyStarLightColorationShader;
  }

  /**
   * A disco like star light.
   */
  class StarLightColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string;
  }
}
