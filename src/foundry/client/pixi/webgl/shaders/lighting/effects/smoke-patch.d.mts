export {};

declare global {
  /**
   * A patch of smoke
   */
  class SmokePatchColorationShader extends AdaptiveColorationShader {
    static override fragmentShader: string | ((...args: any[]) => string);
  }
  /**
   * A patch of smoke
   */
  class SmokePatchIlluminationShader extends AdaptiveIlluminationShader {
    static override fragmentShader: string | ((...args: any[]) => string);
  }
}
