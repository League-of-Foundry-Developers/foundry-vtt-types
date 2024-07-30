export {};

declare global {
  /**
   * Fog animation coloration shader
   */
  class FogColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader(mode: number): string;
  }
}