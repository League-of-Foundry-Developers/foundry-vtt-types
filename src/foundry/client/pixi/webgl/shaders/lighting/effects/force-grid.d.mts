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

    static override fragmentShader: string | ((...args: any[]) => string);
  }
}
