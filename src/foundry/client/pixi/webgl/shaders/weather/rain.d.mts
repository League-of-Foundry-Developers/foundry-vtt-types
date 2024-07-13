export {};

declare global {
  /**
   * Rain shader effect.
   */
  class RainShader extends AbstractWeatherShader {
    /**
     * @defaultValue
     * ```js
     * {
     *    opacity: 1,
     *    intensity: 1,
     *    strength: 1,
     *    rotation: 0.5,
     *    resolution: [3200, 80] // The resolution to have nice rain ropes with the voronoi cells
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    static override fragmentShader: string | ((...args: any[]) => string);
  }
}
