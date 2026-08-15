import type { AnyObject, FixedInstanceType, Identity, ToMethod } from "#utils";
import type BaseShaderMixin from "../mixins/base-shader-mixin.mjs";

/**
 * This class defines an interface which all shaders utilize.
 */
declare abstract class AbstractBaseShader extends BaseShaderMixin(PIXI.Shader) {
  /**
   * @param program  - The program to use with this shader.
   * @param uniforms - The current uniforms of the Shader (default: `{}`)
   */
  constructor(program: PIXI.Program, uniforms?: AbstractBaseShader.Uniforms);

  /**
   * The initial values of the shader uniforms.
   */
  initialUniforms: AbstractBaseShader.Uniforms;

  // fake type override
  static override get defaultUniforms(): AbstractBaseShader.Uniforms;

  static override create<ThisType extends AbstractBaseShader.AnyConstructor>(
    this: ThisType,
    uniforms?: AbstractBaseShader.Uniforms,
    options?: AnyObject,
  ): FixedInstanceType<ThisType>;

  /**
   * Reset the shader uniforms back to their initial values.
   */
  reset(): void;

  /**
   * Perform operations which are required before binding the Shader to the Renderer.
   * @param mesh     - The mesh display object linked to this shader.
   * @param renderer - The renderer
   */
  protected _preRender: AbstractBaseShader.PreRenderFunction;

  /**
   * Identify this class to be compatible with ShaderField
   * @internal
   * @readonly
   */
  static readonly _isShaderFieldCompatible: true;
}

declare namespace AbstractBaseShader {
  interface Any extends AnyAbstractBaseShader {}
  interface AnyConstructor extends Identity<typeof AnyAbstractBaseShader> {}

  type Coordinates = { x: number; y: number; z?: number } | { x: number; y: number; z: number; w?: number };

  type UniformValue =
    | boolean
    | number
    | null
    | Int32List
    | Float32List
    | Coordinates
    | Coordinates[]
    | Color.RGBColorVector
    | Color.RGBAColorVector
    | PIXI.Texture
    | PIXI.Matrix;

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  type Uniforms = {
    readonly [K: string]: AbstractBaseShader.UniformValue;
  };

  type PreRenderFunction = ToMethod<(mesh: PIXI.DisplayObject, renderer: PIXI.Renderer) => void>;
}

export default AbstractBaseShader;

declare abstract class AnyAbstractBaseShader extends AbstractBaseShader {
  constructor(...args: never);
}
