export {};

declare global {
  /**
   * Energy field animation coloration shader
   */
  class EnergyFieldColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string | ((...args: any[]) => string);
  }
}
