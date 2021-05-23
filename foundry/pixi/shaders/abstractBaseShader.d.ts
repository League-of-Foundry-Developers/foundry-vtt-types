/**
 * This class defines an interface which all shaders utilize
 */
declare abstract class AbstractBaseShader extends PIXI.Shader {
  /**
   * Convert a Hue-Saturation-Brightness color to RGB - useful to convert polar coordinates to RGB
   */
  static HSB2RGB: string;

  /**
   * A conventional noise generator
   */
  static NOISE: string;

  /**
   * A conventional pseudo-random number generator with the "golden" numbers, based on uv position
   */
  static PRNG: string;

  /**
   * A Vec3 pseudo-random generator, based on uv position
   */
  static PRNG3D: string;

  /**
   * The default uniform values for the shader.
   * A subclass of AbstractBaseShader must implement the defaultUniforms static field.
   * @defaultValue `{}`
   *
   * @remarks
   * This is abstract, subclasses must implement it.
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;

  /**
   * The fragment shader which renders this source.
   * A subclass of AbstractBaseShader must implement the fragmentShader static field.
   *
   * @remarks
   * This is abstract, subclasses must implement it.
   */
  static fragmentShader: string;

  /**
   * The default vertex shader used by all instances of AbstractBaseShader
   */
  static vertexShader: string;

  /**
   * Fade easing to use with distance in interval [0,1]
   * @param amp  - (default: `3`)
   * @param coef - (default: `0.80`)
   */
  static FADE(amp?: number, coef?: number): string;

  /**
   * TODO: FOR TESTING
   * An alternative easing function which is partially linear followed by exponential falloff
   * @param slope - The slope of linear falloff
   *                (default: `0.2`)
   * @param order - The order of polynomial falloff
   *                (default: `4`)
   */
  static FADE2(slope?: number, order?: number): string;

  /**
   * Fractional Brownian Motion for a given number of octaves
   * @param octaves - (default: `4`)
   * @param amp     - (default: `1.0`)
   */
  static FBM(octaves?: number, amp?: number): string;

  /**
   * A factory method for creating the shader using its defined default values
   */
  static create<T extends AbstractBaseShader>(this: ConstructorOf<T>, defaultUniforms?: AbstractBaseShader.Uniforms): T;

  constructor(program: PIXI.Program, uniforms: AbstractBaseShader.Uniforms);

  /**
   * The initial default values of shader uniforms
   */
  protected _defaults: AbstractBaseShader.Uniforms;

  /**
   * Reset the shader uniforms back to their provided default values
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

  type Uniforms = Partial<Record<string, AbstractBaseShader.UniformValue>>;
}
