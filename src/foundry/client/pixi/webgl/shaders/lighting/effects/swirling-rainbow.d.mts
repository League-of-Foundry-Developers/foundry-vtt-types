export {};

declare global {
  /**
   * Swirling rainbow animation coloration shader
   */
  class SwirlingRainbowColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string | ((...args: any[]) => string);
  }
}
