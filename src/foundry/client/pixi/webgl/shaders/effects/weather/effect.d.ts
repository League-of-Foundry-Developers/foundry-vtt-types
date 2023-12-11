export {};

declare global {
  /**
   * An interface for defining shader-based weather effects
   */
  class WeatherShaderEffect extends QuadMesh {
    /**
     * @param config - The config object to create the shader effect
     */
    constructor(config: any);
  }
}
