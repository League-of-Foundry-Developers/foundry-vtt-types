export {};

declare global {
  /**
   * A futuristic Force Grid animation.
   */
  class ForceGridColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string;
  }

  namespace ForceGridColorationShader {
    type Any = AnyForceGridColorationShader;
    type AnyConstructor = typeof AnyForceGridColorationShader;
  }
}

declare abstract class AnyForceGridColorationShader extends ForceGridColorationShader {
  constructor(arg0: never, ...args: never[]);
}
