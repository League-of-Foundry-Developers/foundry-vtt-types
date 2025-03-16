import type { Identity } from "../../../../../../utils/index.d.mts";

declare global {
  /**
   * The filter used by the weather layer to mask weather above occluded roofs.
   * @see {@link WeatherEffects | `WeatherEffects`}
   */
  class WeatherOcclusionMaskFilter extends AbstractBaseMaskFilter {
    /**
     * Elevation of this weather occlusion mask filter.
     * @defaultValue `Infinity`
     */
    elevation: number;

    static override vertexShader: string;

    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *   depthElevation: 0,
     *   useOcclusion: true,
     *   occlusionTexture: null,
     *   everseOcclusion: false,
     *   occlusionWeights: [0, 0, 1, 0],
     *   seTerrain: false,
     *   terrainTexture: null,
     *   reverseTerrain: false,
     *   terrainWeights: [1, 0, 0, 0],
     *   sceneDimensions: [0, 0],
     *   sceneAnchor: [0, 0]
     *   terrainUvMatrix: new PIXI.Matrix()
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    override apply(
      filterManager: PIXI.FilterSystem,
      input: PIXI.RenderTexture,
      output: PIXI.RenderTexture,
      clear: PIXI.CLEAR_MODES,
      currentState: PIXI.FilterState,
    ): void;
  }

  namespace WeatherOcclusionMaskFilter {
    interface Any extends AnyWeatherOcclusionMaskFilter {}
    interface AnyConstructor extends Identity<typeof AnyWeatherOcclusionMaskFilter> {}
  }
}

declare abstract class AnyWeatherOcclusionMaskFilter extends WeatherOcclusionMaskFilter {
  constructor(arg0: never, ...args: never[]);
}
