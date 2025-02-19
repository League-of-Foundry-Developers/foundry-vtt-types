import type { RemoveIndexSignatures, FixedInstanceType } from "../../../../../../utils/index.d.mts";

type AbstractBaseShaderClass = typeof AbstractBaseShader;

interface InternalAbstractWeatherShader_Interface extends AbstractBaseShaderClass {
  new <_ComputedUniforms extends object>(
    ...args: ConstructorParameters<typeof AbstractBaseShader>
  ): AbstractBaseShader & _ComputedUniforms;
}

declare const InternalAbstractWeatherShader_Const: InternalAbstractWeatherShader_Interface;

// @ts-expect-error - This pattern inherently requires a ts-expect-error as the base class is dynamic.
class InternalAbstractWeatherShader<
  DefaultUniforms extends AbstractBaseShader.Uniforms,
  _ComputedUniforms extends object = RemoveIndexSignatures<DefaultUniforms>,
> extends InternalAbstractWeatherShader_Const<_ComputedUniforms> {}

declare global {
  /**
   * The base shader class for weather shaders.
   * @typeParam DefaultUniforms - An interface representing an `AbstractWeatherShader` subclass's `static defaultUniforms`
   * @remarks For each key in `static defaultOptions`, dynamically defines a getter/setter pair for `this.uniforms[key]` on the instance
   */
  class AbstractWeatherShader<
    DefaultUniforms extends AbstractBaseShader.Uniforms = AbstractWeatherShader.DefaultUniforms,
  > extends InternalAbstractWeatherShader<DefaultUniforms> {
    constructor(...args: ConstructorParameters<typeof AbstractBaseShader>);

    /**
     * Compute the weather masking value.
     */
    static COMPUTE_MASK: string;

    /**
     * Compute the weather masking value.
     */
    static FRAGMENT_HEADER: string;

    static commonUniforms: AbstractWeatherShader.CommonUniforms;

    /**
     * Default uniforms for a specific class
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    static override create<ThisType extends AbstractBaseShader.AnyConstructor>(
      this: ThisType,
      initialUniforms?: AbstractBaseShader.Uniforms,
    ): FixedInstanceType<ThisType>;

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

  namespace AbstractWeatherShader {
    interface Any extends AnyAbstractWeatherShader {}
    type AnyConstructor = typeof AnyAbstractWeatherShader;

    interface CommonUniforms extends AbstractBaseShader.Uniforms {
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
      tint: Color.RGBColorVector;
      screenDimensions: [number, number];
      effectDimensions: [number, number];
      depthElevation: number;
      time: number;
    }

    interface DefaultUniforms extends AbstractBaseShader.Uniforms {}
  }
}

declare abstract class AnyAbstractWeatherShader extends AbstractWeatherShader<AbstractWeatherShader.DefaultUniforms> {
  constructor(arg0: never, ...args: never[]);
}
