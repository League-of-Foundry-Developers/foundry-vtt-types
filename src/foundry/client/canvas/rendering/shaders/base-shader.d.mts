import type { FixedInstanceType, Identity, ToMethod } from "#utils";
import type BaseShaderMixin from "../mixins/base-shader-mixin.mjs";

/**
 * This class defines an interface which all shaders utilize
 */
declare abstract class AbstractBaseShader extends BaseShaderMixin(PIXI.Shader) {
  /**
   * @param program  - The program to use with this shader.
   * @param uniforms - The current uniforms of the Shader (default: `{}`)
   */
  constructor(program: PIXI.Program, uniforms?: AbstractBaseShader.Uniforms);

  /**
   * Identify this class to be compatible with ShaderField
   * @internal
   * @remarks This is `defineProperty`'d on the class after its definition, with `writable: false, enumerable: false, configurable: false`
   */
  protected static readonly _isShaderFieldCompatible: true;

  /**
   * The raw vertex shader used by this class.
   * A subclass of AbstractBaseShader must implement the vertexShader static field.
   * @defaultValue `""`
   */
  static vertexShader: string;

  /**
   * The raw fragment shader used by this class.
   * A subclass of AbstractBaseShader must implement the fragmentShader static field.
   * @defaultValue `""`
   */
  static fragmentShader: string | AbstractBaseShader.FragmentShaderFunction;

  /**
   * The default uniform values for the shader.
   * A subclass of AbstractBaseShader must implement the defaultUniforms static field.
   * @defaultValue `{}`
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;

  /**
   * The initial values of the shader uniforms.
   * @remarks Set during construction
   */
  initialUniforms: AbstractBaseShader.Uniforms;

  /**
   * A factory method for creating the shader using its defined default values
   */
  static create<ThisType extends AbstractBaseShader.AnyConstructor>(
    this: ThisType,
    initialUniforms?: AbstractBaseShader.Uniforms,
  ): FixedInstanceType<ThisType>;

  /**
   * Reset the shader uniforms back to their initial values.
   */
  protected reset(): void;

  /**
   * A one time initialization performed on creation.
   * @remarks Does nothing without subclass implementation.
   */
  protected _configure(): void;

  /**
   * Perform operations which are required before binding the Shader to the Renderer.
   * @param mesh - The mesh display object linked to this shader.
   * @param renderer - The renderer
   * @privateRemarks Foundry marks this as protected despite it getting called from `QuadMesh#_render`
   */
  protected _preRender: AbstractBaseShader.PreRenderFunction;

  /**
   * The initial default values of shader uniforms
   * @deprecated since v12, until v14
   * @remarks AbstractBaseShader#_defaults is deprecated in favor of AbstractBaseShader#initialUniforms.
   */
  protected get _defaults(): AbstractBaseShader.Uniforms;
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

  type FragmentShaderFunction = ToMethod<(arg0: never) => string>;

  type PreRenderFunction = ToMethod<(mesh: PIXI.DisplayObject, renderer: PIXI.Renderer) => void>;
}

export default AbstractBaseShader;

declare abstract class AnyAbstractBaseShader extends AbstractBaseShader {
  constructor(...args: never);
}
