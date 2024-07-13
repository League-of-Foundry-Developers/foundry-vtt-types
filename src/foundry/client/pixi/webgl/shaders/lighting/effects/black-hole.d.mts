export {};

declare global {
  /**
   * Black Hole animation illumination shader
   */
  class BlackHoleDarknessShader extends AdaptiveDarknessShader {
    static override fragmentShader: string | ((...args: any[]) => string);
  }
}
