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

    static override fragmentShader: string | ((...args: any[]) => string);
  }
}
