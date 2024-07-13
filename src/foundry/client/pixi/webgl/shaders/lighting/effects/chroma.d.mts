export {};

declare global {
  /**
   * Chroma animation coloration shader
   */
  class ChromaColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string | ((...args: any[]) => string);
  }
}
