import type { ConstructorOf } from "../../../../../../types/utils.d.mts";

declare global {
  /**
   * The base shader class for weather shaders.
   */
  class AbstractWeatherShader extends AbstractBaseShader {
    /**
     * Compute the weather masking value.
     */
    static COMPUTE_MASK: string;

    /**
     * Compute the weather masking value.
     */
    static FRAGMENT_HEADER: string;

    static commonUniforms: AbstractWeatherShader.commonUniforms;

    /**
     * Default uniforms for a specific class
     * @remarks No default value, marked as abstract
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    static override create<T extends AbstractWeatherShader>(
      this: ConstructorOf<T>,
      initialUniforms?: AbstractBaseShader.Uniforms,
    ): T;

    /**
     * Create the shader program.
     */
    static createProgram(): PIXI.Program;

    static override vertexShader: string;

    /**
     * Update the scale of this effect with new values
     * @param scale - The desired scale
     */
    set scale(scale: number | { x: number; y: number });

    set scaleX(x: number);

    set scaleY(y: number);

    /**
     * The speed multiplier applied to animation.
     * 0 stops animation.
     * @defaultValue `1`
     */
    speed: number;

    /**
     * Perform operations which are required before binding the Shader to the Renderer.
     * @param mesh - The mesh linked to this shader.
     */
    protected _preRender(mesh: PIXI.DisplayObject, renderer: PIXI.Renderer): void;
  }

  namespace AbstractWeatherShader {
    interface commonUniforms {
      useOcclusion: boolean;
      occlusionTexture: PIXI.Texture | null;
      reverseOcclusion: boolean;
      occlusionWeights: number[];
      useTerrain: boolean;
      terrainTexture: PIXI.Texture | null;
      reverseTerrain: boolean;
      terrainWeights: number[];
      alpha: number;
      tint: number[];
      screenDimensions: [number, number];
      effectDimensions: [number, number];
      depthElevation: number;
      time: number;
    }
  }
}
