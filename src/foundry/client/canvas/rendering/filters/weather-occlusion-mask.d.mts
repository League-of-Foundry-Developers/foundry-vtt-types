import type { Identity } from "#utils";
import type { AbstractBaseMaskFilter } from "./_module.d.mts";
import type { AbstractBaseShader } from "../shaders/_module.mjs";

/**
 * The filter used by the weather layer to mask weather above occluded roofs.
 * @see {@linkcode foundry.canvas.layers.WeatherEffects}
 */
declare class WeatherOcclusionMaskFilter extends AbstractBaseMaskFilter {
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
   *   reverseOcclusion: false,
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
    clear?: PIXI.CLEAR_MODES,
    currentState?: PIXI.FilterState,
  ): void;
}

declare namespace WeatherOcclusionMaskFilter {
  interface Any extends AnyWeatherOcclusionMaskFilter {}
  interface AnyConstructor extends Identity<typeof AnyWeatherOcclusionMaskFilter> {}
}

export default WeatherOcclusionMaskFilter;

declare abstract class AnyWeatherOcclusionMaskFilter extends WeatherOcclusionMaskFilter {
  constructor(...args: never);
}
