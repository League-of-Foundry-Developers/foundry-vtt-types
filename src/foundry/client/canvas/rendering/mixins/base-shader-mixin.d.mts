import type { AnyObject, FixedInstanceType, Mixin } from "#utils";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare class BaseShader {
  /** @privateRemarks All mixin classes should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * The default uniform values for the shader.
   * A subclass of BaseShaderMixin must implement the defaultUniforms static getter.
   */
  static get defaultUniforms(): AnyObject;

  /**
   * Handle creation of the vertex shader string for this class.
   * If this method is not provided, PIXI will assign a default vertex for this shader.
   * @param options - Configuration options passed at creation time.
   * @remarks Returns `undefined` when this class does not provide a vertex shader, allowing PIXI to use its default.
   */
  protected static _createVertexShader(options?: AnyObject): string | undefined;

  /**
   * Handle creation of the fragment shader string for this class.
   * If this method is not provided, PIXI will assign a default fragment for this shader.
   * @param options - Configuration options passed at creation time.
   * @remarks Returns `undefined` when this class does not provide a fragment shader, allowing PIXI to use its default.
   * @privateRemarks Uncallable; variadic so subclasses can declare their own parameters, including
   * `GlowOverlayFilter`'s `(quality, distance)`.
   */
  protected static _createFragmentShader(...options: never): string | undefined;

  /**
   * A factory method for creating the shader using its defined default values.
   * @param uniforms - An object of uniform values which override the class {@link defaultUniforms}.
   * @param options  - Optional configuration parameters which may influence shader creation or initialization.
   * @abstract
   */
  static create(uniforms?: AnyObject, options?: AnyObject): BaseShader;

  /**
   * A one time initialization performed on creation.
   * Subclasses may override to perform custom configuration of uniforms or state.
   * @param options - Configuration options provided at creation time.
   */
  protected _configure(options?: AnyObject): void;

  /**
   * Useful constant values computed at compile time
   */
  static CONSTANTS: string;

  /**
   * Fast approximate perceived brightness computation
   * Using Digital ITU BT.709 : Exact luminance factors
   */
  static PERCEIVED_BRIGHTNESS: string;

  /**
   * Simplex 3D noise functions
   */
  static SIMPLEX_3D: string;

  /**
   * Conversion functions for sRGB and Linear RGB.
   */
  static COLOR_SPACES: string;

  /**
   * Fractional Brownian Motion for a given number of octaves
   * @param octaves - (default: `4`)
   * @param amp     - (default: `1.0`)
   */
  static FBM(octaves?: number, amp?: number): string;

  /**
   * High Quality Fractional Brownian Motion.
   * @param octaves       - Number of octaves (iteration). (default: `3`)
   * @param fbmFuncName   - Name of the fbm function. (default `"fbm"`)
   * @param noiseFuncName - Name of the noise function to use inside fbm (must return a `float`). (default: `"noise"`)
   * @param vecType       - The vec type the function accepts as a parameter. (default: `"vec2"`)
   * @returns The formed fbm function
   */
  static FBMHQ(octaves?: number, fbmFuncName?: string, noiseFuncName?: string, vecType?: string): string;

  /**
   * Angular constraint working with coordinates on the range [-1, 1]
   * =\> coord: Coordinates
   * =\> angle: Angle in radians
   * =\> smoothness: Smoothness of the pie
   * =\> l: Length of the pie.
   */
  static PIE: string;

  /**
   * A conventional pseudo-random number generator with the "golden" numbers, based on uv position
   */
  static PRNG_LEGACY: string;

  /**
   * A pseudo-random number generator based on uv position which does not use cos/sin
   * This PRNG replaces the old PRNG_LEGACY to workaround some driver bugs
   */
  static PRNG: string;

  /**
   * A Vec2 pseudo-random generator, based on uv position
   */
  static PRNG2D: string;

  /**
   * A Vec3 pseudo-random generator, based on uv position
   */
  static PRNG3D: string;

  /**
   * A conventional noise generator
   */
  static NOISE: string;

  /**
   * Convert a Hue-Saturation-Brightness color to RGB - useful to convert polar coordinates to RGB
   */
  static HSB2RGB: string;

  /**
   * Declare a wave function in a shader -\> wcos (default), wsin or wtan.
   * Wave on the [v1,v2] range with amplitude -\> a and speed -\> speed.
   * @param func - the math function to use (default: `"cos"`)
   */
  static WAVE(func?: BaseShaderMixin.WaveTrigFunction): string;

  /**
   * Rotation function.
   */
  static ROTATION: string;

  /**
   * Voronoi noise function. Needs PRNG2D and CONSTANTS.
   * @see {@linkcode PRNG2D}
   * @see {@linkcode CONSTANTS}
   */
  static VORONOI: string;

  /**
   * Enables GLSL 1.0 backwards compatibility in GLSL 3.00 ES vertex shaders.
   */
  static GLSL1_COMPATIBILITY_VERTEX: string;

  /**
   * Enables GLSL 1.0 backwards compatibility in GLSL 3.00 ES fragment shaders.
   */
  static GLSL1_COMPATIBILITY_FRAGMENT: string;

  /** @ignore */
  protected static _fragmentShaderCompatibility(options?: AnyObject): string | undefined;

  /** @ignore */
  protected static _vertexShaderCompatibility(options?: AnyObject): string | undefined;

  /**
   * @remarks Absent unless a class still declares it; its presence is what selects the compatibility path.
   * @deprecated `fragmentShader` getter is deprecated in favor of {@linkcode _createFragmentShader}. (since v14, until v16)
   */
  static fragmentShader?: BaseShaderMixin.ShaderSource | undefined;

  /**
   * @remarks Absent unless a class still declares it; its presence is what selects the compatibility path.
   * @deprecated `vertexShader` getter is deprecated in favor of {@linkcode _createVertexShader}. (since v14, until v16)
   */
  static vertexShader?: BaseShaderMixin.ShaderSource | undefined;
}

/**
 * A mixin which decorates a PIXI.Filter or PIXI.Shader with common properties.
 * @param ShaderClass - The parent ShaderClass class being mixed.
 */
declare function BaseShaderMixin<BaseClass extends BaseShaderMixin.BaseClass>(
  ShaderClass: BaseClass,
): Mixin<typeof BaseShader, BaseClass>;

declare namespace BaseShaderMixin {
  /** @privateRemarks `AnyMixed` can't extend `AnyMixedConstructor` if it's using the `BaseClass` union; `PIXI.Shader` is the parent of `Filter`, so it's used instead */
  interface AnyMixedConstructor extends ReturnType<typeof BaseShaderMixin<PIXI.Shader.AnyConstructor>> {}
  interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

  type BaseClass = PIXI.Shader.AnyConstructor | PIXI.Filter.AnyConstructor;

  type ShaderSource = string | ((options?: AnyObject) => string);

  type WaveTrigFunction = "cos" | "sin" | "tan";
}

export default BaseShaderMixin;
