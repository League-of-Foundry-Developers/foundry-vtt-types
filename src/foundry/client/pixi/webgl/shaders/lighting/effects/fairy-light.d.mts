export {};

declare global {
  /**
   * Fairy light animation coloration shader
   */
  class FairyLightColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string | ((...args: any[]) => string);
  }

  /**
   * Fairy light animation illumination shader
   */
  class FairyLightIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string | ((...args: any[]) => string);
  }
}
