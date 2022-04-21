/**
 * This class defines an interface which all shaders utilize
 */
declare abstract class AbstractBaseShader extends PIXI.Shader {
  /** The current uniforms of the Shader */
  uniforms: AbstractBaseShader.Uniforms;

  constructor(program: PIXI.Program, uniforms: AbstractBaseShader.Uniforms);

  /**
   * The initial default values of shader uniforms
   */
  protected _defaults: AbstractBaseShader.Uniforms;

  /**
   * The raw vertex shader used by this class.
   * A subclass of AbstractBaseShader must implement the vertexShader static field.
   * @defaultValue `""`
   *
   * @remarks This is abstract, subclasses must implement it.
   */
  static vertexShader: string;

  /**
   * The raw fragment shader used by this class.
   * A subclass of AbstractBaseShader must implement the fragmentShader static field.
   * @defaultValue `""`
   *
   * @remarks This is abstract, subclasses must implement it.
   */
  static fragmentShader: string;

  /**
   * The default uniform values for the shader.
   * A subclass of AbstractBaseShader must implement the defaultUniforms static field.
   * @defaultValue `{}`
   *
   * @remarks This is abstract, subclasses must implement it.
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;

  /**
   * A factory method for creating the shader using its defined default values
   */
  static create<T extends AbstractBaseShader>(this: ConstructorOf<T>, defaultUniforms?: AbstractBaseShader.Uniforms): T;

  /**
   * Reset the shader uniforms back to their provided default values
   * @internal
   */
  protected reset(): void;
}

declare namespace AbstractBaseShader {
  type UniformValue =
    | boolean
    | number
    | Int32List
    | Float32List
    | { x: number; y: number }
    | { x: number; y: number; z: number }
    | { x: number; y: number; z: number; w: number }
    | { x: number; y: number }[]
    | { x: number; y: number; z: number }[]
    | { x: number; y: number; z: number; w: number }[]
    | PIXI.Texture;

  type Uniforms = Record<string, AbstractBaseShader.UniformValue>;
}
