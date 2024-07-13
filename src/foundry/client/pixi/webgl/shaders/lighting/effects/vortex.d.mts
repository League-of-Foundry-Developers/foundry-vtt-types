export {};

declare global {
  /**
   * Vortex animation coloration shader
   */
  class VortexColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string | ((...args: any[]) => string);
  }

  /**
   * Vortex animation coloration shader
   */
  class VortexIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string | ((...args: any[]) => string);
  }
}
