export {};

declare global {
  /**
   * Radial rainbow animation coloration shader
   */
  class RadialRainbowColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string | ((...args: any[]) => string);
  }
}
