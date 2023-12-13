export {};

declare global {
  /**
   * Fog shader effect.
   */
  class FogShader extends AbstractWeatherShader {
    /**
     * @defaultValue
     * ```js
     * {
     *    intensity: 1,
     *    rotation: 0,
     *    slope: 0.25
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * Configure the number of octaves into the shaders.
     */
    static OCTAVES(mode: number): string;

    /**
     * Configure the fog complexity according to mode (performance).
     */
    static FOG(mode: number): string;

    static override createProgram(): PIXI.Program;

    static override fragmentShader(mode: number): string;
  }
}
