import type { AnyConstructorFor, Mixin } from "../../../../../types/utils.d.mts";

export {};

/** @remarks Class name adjusted to avoid name collision with function */
declare class BaseShaderMixinClass {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * Useful constant values computed at compile time
   */
  static CONSTANTS: string;

  /* -------------------------------------------- */

  /**
   * Fast approximate perceived brightness computation
   * Using Digital ITU BT.709 : Exact luminance factors
   */
  static PERCEIVED_BRIGHTNESS: string;

  /**
   * Convertion functions for sRGB and Linear RGB.
   */
  static COLOR_SPACES: string;

  /**
   * Fractional Brownian Motion for a given number of octaves
   * @param octaves - (default: `4`)
   * @param amp     - (default: `1.0`)
   */
  static FBM(octaves: number, amp: number): string;

  /**
   * High Quality Fractional Brownian Motion
   * @param octaves - (default: `3`)
   */
  static FBMHQ(octaves: number): string;

  /**
   * Angular constraint working with coordinates on the range [-1, 1]
   * =\> coord: Coordinates
   * =\> angle: Angle in radians
   * =\> smoothness: Smoothness of the pie
   * =\> l: Length of the pie.
   * @defaultValue
   * ```js
   * `float pie(in vec2 coord, in float angle, in float smoothness, in float l) {
   * coord.x = abs(coord.x);
   * vec2 va = vec2(sin(angle), cos(angle));
   * float lg = length(coord) - l;
   * float clg = length(coord - va * clamp(dot(coord, va) , 0.0, l));
   * return smoothstep(0.0, smoothness, max(lg, clg * sign(va.y * coord.x - va.x * coord.y)));
   * }`
   * ```
   */
  static PIE: string;

  /* -------------------------------------------- */

  /**
   * A conventional pseudo-random number generator with the "golden" numbers, based on uv position
   * @defaultValue
   * ```js
   * `float random(in vec2 uv) {
   *  return fract(cos(dot(uv, vec2(12.9898, 4.1414))) * 43758.5453);
   * }`
   * ```
   */
  static PRNG_LEGACY: string;

  /* -------------------------------------------- */

  /**
   * A pseudo-random number generator based on uv position which does not use cos/sin
   * This PRNG replaces the old PRNG_LEGACY to workaround some driver bugs
   * @defaultValue
   * ```js
   * `float random(in vec2 uv) {
   *  * uv = mod(uv, 1000.0);
   *  return fract( dot(uv, vec2(5.23, 2.89)
   *                    * fract((2.41 * uv.x + 2.27 * uv.y)
   *                              * 251.19)) * 551.83);`
   * }
   * ```
   */
  static PRNG: string;

  /* -------------------------------------------- */

  /**
   * A Vec2 pseudo-random generator, based on uv position
   * @defaultValue
   * ```js
   * `vec2 random(in vec2 uv) {
   * vec2 uvf = fract(uv * vec2(0.1031, 0.1030));
   * uvf += dot(uvf, uvf.yx + 19.19);
   * return fract((uvf.x + uvf.y) * uvf);`
   * }
   * ```
   */
  static PRNG2D: string;

  /* -------------------------------------------- */

  /**
   * A Vec3 pseudo-random generator, based on uv position
   * @defaultValue
   * ```js
   * `vec3 random(in vec3 uv) {
   * return vec3(fract(cos(dot(uv, vec3(12.9898,  234.1418,    152.01))) * 43758.5453),
   *           fract(sin(dot(uv, vec3(80.9898,  545.8937, 151515.12))) * 23411.1789),
   *           fract(cos(dot(uv, vec3(01.9898, 1568.5439,    154.78))) * 31256.8817));`
   * }
   * ```
   */
  static PRNG3D: string;

  /* -------------------------------------------- */

  /**
   * A conventional noise generator
   * @defaultValue
   * ```js
   * `float noise(in vec2 uv) {
   *  const vec2 d = vec2(0.0, 1.0);
   *  vec2 b = floor(uv);
   *  vec2 f = smoothstep(vec2(0.), vec2(1.0), fract(uv));
   *  return mix(
   *    mix(random(b), random(b + d.yx), f.x),
   *    mix(random(b + d.xy), random(b + d.yy), f.x),
   *    f.y
   *  );`
   * }
   * ```
   */
  static NOISE: string;

  /* -------------------------------------------- */

  /**
   * Convert a Hue-Saturation-Brightness color to RGB - useful to convert polar coordinates to RGB
   * @defaultValue
   * ```js
   * vec3 hsb2rgb(in vec3 c) {
   * vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0 );
   * rgb = rgb*rgb*(3.0-2.0*rgb);
   * return c.z * mix(vec3(1.0), rgb, c.y);
   * }
   * ```
   */
  static HSB2RGB: string;

  /**
   * Declare a wave function in a shader -\> wcos (default), wsin or wtan.
   * Wave on the [v1,v2] range with amplitude -\> a and speed -\> speed.
   * @param func - the math function to use
   *               (default: `"cos"`)
   */
  static WAVE(func?: string): string;

  /**
   * Rotation function.
   * @defaultValue
   * ```js
   * `mat2 rot(in float a) {
   * float s = sin(a);
   * float c = cos(a);
   * return mat2(c, -s, s, c);
   * }`
   * ```
   */
  static ROTATION: string;

  /* -------------------------------------------- */

  /**
   * Voronoi noise function. Needs PRNG2D and CONSTANTS.
   * @defaultValue
   * ```js
   * `vec3 voronoi(in vec2 uv, in float t, in float zd) {
   *  vec3 vor = vec3(0.0, 0.0, zd);
   *  vec2 uvi = floor(uv);
   *  vec2 uvf = fract(uv);
   *  for ( float j = -1.0; j <= 1.0; j++ ) {
   *    for ( float i = -1.0; i <= 1.0; i++ ) {
   *      vec2 uvn = vec2(i, j);
   *      vec2 uvr = 0.5 * sin(TWOPI * random(uvi + uvn) + t) + 0.5;
   *      uvr = 0.5 * sin(TWOPI * uvr + t) + 0.5;
   *      vec2 uvd = uvn + uvr - uvf;
   *      float dist = length(uvd);
   *      if ( dist < vor.z ) {
   *        vor.xy = uvr;
   *        vor.z = dist;
   *      }
   *    }
   *  }
   *  return vor;
   * }
   *
   * vec3 voronoi(in vec2 vuv, in float zd)  {
   *  return voronoi(vuv, 0.0, zd);
   * }
   *
   * vec3 voronoi(in vec3 vuv, in float zd)  {
   *  return voronoi(vuv.xy, vuv.z, zd);
   * }`
   * ```
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
}

declare global {
  function BaseShaderMixin<BaseClass extends AnyConstructorFor<typeof PIXI.Shader | typeof PIXI.Filter>>(
    ShaderClass: BaseClass,
  ): Mixin<typeof BaseShaderMixinClass, BaseClass>;
}
