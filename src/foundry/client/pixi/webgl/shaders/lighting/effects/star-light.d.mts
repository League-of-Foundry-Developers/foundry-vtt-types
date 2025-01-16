export {};

declare global {
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

  namespace StarLightColorationShader {
    interface Any extends AnyStarLightColorationShader {}
    type AnyConstructor = typeof AnyStarLightColorationShader;
  }
}

declare abstract class AnyStarLightColorationShader extends StarLightColorationShader {
  constructor(arg0: never, ...args: never[]);
}
