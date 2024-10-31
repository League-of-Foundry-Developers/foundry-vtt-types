export {};

declare abstract class AnyForceGridColorationShader extends ForceGridColorationShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace ForceGridColorationShader {
    type AnyConstructor = typeof AnyForceGridColorationShader;
  }
  /**
   * A futuristic Force Grid animation.
   */
  class ForceGridColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: AbstractBaseShader.FragmentShader;
  }
}
