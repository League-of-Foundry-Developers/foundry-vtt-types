import type { AnyObject } from "../../../../../../types/utils.d.mts";

export {};

declare abstract class AnyAbstractWeatherShader extends AbstractWeatherShader {
  constructor(arg0: never, ...args: never[]);
}

type AbstractBaseShaderClass = typeof AbstractBaseShader;

interface InternalAbstractWeatherShader_Interface extends AbstractBaseShaderClass {
  new <Uniforms extends object>(
    ...args: ConstructorParameters<typeof AbstractBaseShader>
  ): AbstractBaseShader & Uniforms;
}

declare const InternalAbstractWeatherShader_Const: InternalAbstractWeatherShader_Interface;

declare global {
  namespace AbstractWeatherShader {
    type AnyConstructor = typeof AnyAbstractWeatherShader;

    interface commonUniforms {
      terrainUvMatrix: PIXI.Matrix;
      useOcclusion: boolean;
      occlusionTexture: PIXI.Matrix | null;
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

  /**
   * The base shader class for weather shaders.
   */
  class AbstractWeatherShader<
    DefaultUniforms extends AbstractBaseShader.Uniforms = AbstractBaseShader.Uniforms,
  > extends InternalAbstractWeatherShader_Const<Extract<DefaultUniforms, AnyObject>> {
    constructor(...args: ConstructorParameters<typeof AbstractBaseShader>);

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

    static override create<ThisType extends AbstractBaseShader.AnyConstructor>(
      this: ThisType,
      initialUniforms?: AbstractBaseShader.Uniforms,
    ): InstanceType<ThisType>;

    /**
     * Create the shader program.
     */
    static createProgram(): PIXI.Program;

    static override vertexShader: string;

    /**
     * Update the scale of this effect with new values
     * @param scale - The desired scale
     */
    set scale(scale: number | { x: number; y?: number });

    set scaleX(x: number);

    set scaleY(y: number);

    /**
     * The speed multiplier applied to animation.
     * 0 stops animation.
     * @defaultValue `1`
     */
    speed: number;

    protected override _preRender: AbstractBaseShader.PreRenderFunction;
  }
}
