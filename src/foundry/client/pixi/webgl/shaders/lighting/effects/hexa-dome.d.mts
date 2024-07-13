export {};

declare global {
  /**
   * Hexagonal dome animation coloration shader
   */
  class HexaDomeColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string | ((...args: any[]) => string);
  }
}
