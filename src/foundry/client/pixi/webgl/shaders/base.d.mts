import type { ConstructorOf, Mixin } from "../../../../../types/utils.d.mts";

/** @remarks Class name adjusted to avoid name collision with function */
declare class BaseShaderMixinClass {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * Common attributes for vertex shaders.
   * @defaultValue
   * ```js
   * `attribute vec2 aVertexPosition;
   * attribute float aDepthValue;`
   * ```
   */
  static VERTEX_ATTRIBUTES: string;

  /**
   * Common uniforms for vertex shaders.
   * @defaultValue
   * ```js
   * `uniform mat3 translationMatrix;
   * uniform mat3 projectionMatrix;
   * uniform float rotation;
   * uniform float angle;
   * uniform float radius;
   * uniform float depthElevation;
   * uniform vec2 screenDimensions;
   * uniform vec2 resolution;
   * uniform vec3 origin;
   * uniform vec3 dimensions;`
   * ```
   */
  static VERTEX_UNIFORMS: string;

  /**
   * Common varyings shared by vertex and fragment shaders.
   * @defaultValue
   * ```js
   * `varying vec2 vUvs;
   * varying vec2 vSamplerUvs;
   * varying float vDepth;`
   * ```
   */
  static VERTEX_FRAGMENT_VARYINGS: string;

  /**
   * Common uniforms shared by fragment shaders.
   * @defaultValue
   * ```js
   * `uniform int technique;
   * uniform bool useSampler;
   * uniform bool darkness;
   * uniform bool hasColor;
   * uniform bool linkedToDarknessLevel;
   * uniform float attenuation;
   * uniform float contrast;
   * uniform float shadows;
   * uniform float exposure;
   * uniform float saturation;
   * uniform float intensity;
   * uniform float brightness;
   * uniform float luminosity;
   * uniform float pulse;
   * uniform float brightnessPulse;
   * uniform float backgroundAlpha;
   * uniform float illuminationAlpha;
   * uniform float colorationAlpha;
   * uniform float ratio;
   * uniform float time;
   * uniform float darknessLevel;
   * uniform float darknessPenalty;
   * uniform vec3 color;
   * uniform vec3 colorBackground;
   * uniform vec3 colorVision;
   * uniform vec3 colorTint;
   * uniform vec3 colorEffect;
   * uniform vec3 colorDim;
   * uniform vec3 colorBright;
   * uniform vec3 ambientDaylight;
   * uniform vec3 ambientDarkness;
   * uniform vec3 ambientBrightest;
   * uniform vec4 weights;
   * uniform sampler2D primaryTexture;
   * uniform sampler2D framebufferTexture;
   * uniform sampler2D depthTexture;
   *
   * // Shared uniforms with vertex shader
   * uniform ${PIXI.settings.PRECISION_VERTEX} float rotation;
   * uniform ${PIXI.settings.PRECISION_VERTEX} float angle;
   * uniform ${PIXI.settings.PRECISION_VERTEX} float radius;
   * uniform ${PIXI.settings.PRECISION_VERTEX} float depthElevation;
   * uniform ${PIXI.settings.PRECISION_VERTEX} vec2 resolution;
   * uniform ${PIXI.settings.PRECISION_VERTEX} vec2 screenDimensions;
   * uniform ${PIXI.settings.PRECISION_VERTEX} vec3 origin;
   * uniform ${PIXI.settings.PRECISION_VERTEX} vec3 dimensions;
   * uniform ${PIXI.settings.PRECISION_VERTEX} mat3 translationMatrix;
   * uniform ${PIXI.settings.PRECISION_VERTEX} mat3 projectionMatrix;`
   * ```
   */
  static FRAGMENT_UNIFORMS: string;

  /**
   * Useful constant values computed at compile time
   * @defaultValue
   * ```js
   * `const float PI = 3.14159265359;
   * const float TWOPI = 2.0 * PI;
   * const float INVTWOPI = 1.0 / TWOPI;
   * const float INVTHREE = 1.0 / 3.0;
   * const vec2 PIVOT = vec2(0.5);
   * const vec3 BT709 = vec3(0.2126, 0.7152, 0.0722);
   * const vec4 ALLONES = vec4(1.0);`
   * ```
   */
  static CONSTANTS: string;

  /* -------------------------------------------- */

  /**
   * Fast approximate perceived brightness computation
   * Using Digital ITU BT.709 : Exact luminance factors
   * @defaultValue
   * ```js
   * `float perceivedBrightness(in vec3 color) {
   * return sqrt( BT709.x * color.r * color.r +
   *              BT709.y * color.g * color.g +
   *              BT709.z * color.b * color.b );
   * }
   *
   * float perceivedBrightness(in vec4 color) {
   * return perceivedBrightness(color.rgb);
   * }
   *
   * float reversePerceivedBrightness(in vec3 color) {
   * return 1.0 - perceivedBrightness(color);
   * }
   *
   * float reversePerceivedBrightness(in vec4 color) {
   * return 1.0 - perceivedBrightness(color.rgb);
   * }`
   * ```
   */
  static PERCEIVED_BRIGHTNESS: string;

  /**
   * Fractional Brownian Motion for a given number of octaves
   * @param octaves - (default: `4`)
   * @param amp - (default: `1.0`)
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
}

/** @remarks Class name adjusted to avoid name collision with function */
declare class AdaptiveFragmentChannelMixinClass {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * The fragment shader which renders this filter.
   * A subclass of AdaptiveFragmentChannelMixin must implement the fragmentShader static field.
   * @defaultValue `null`
   */
  static adaptiveFragmentShader: ((channel: AdaptiveFragmentChannel.Channel) => string) | null;

  /**
   * A factory method for creating the filter using its defined default values
   * @param options - Options which affect filter construction
   */
  static create(options?: {
    /**
     * Initial uniforms provided to the filter
     */
    uniforms?: AbstractBaseShader.Uniforms;

    /**
     * A color channel to target for masking.
     * @defaultValue `r`
     */
    channel?: string;
  }): InverseOcclusionMaskFilter;
}

declare global {
  namespace AbstractBaseShader {
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

  function BaseShaderMixin<BaseClass extends BaseShaderMixin.BaseClass>(
    ShaderClass: BaseClass,
  ): Mixin<typeof BaseShaderMixinClass, BaseClass>;

  namespace BaseShaderMixin {
    type BaseClass = typeof AnyPIXIShader | typeof AnyPIXIFilter;
  }

  namespace AdaptiveFragmentChannel {
    type Channel = "r" | "g" | "b";
  }

  function AdaptiveFragmentChannelMixin<BaseClass extends AdaptiveFragmentChannelMixin.BaseClass>(
    ShaderClass: BaseClass,
  ): Mixin<typeof AdaptiveFragmentChannelMixinClass, BaseClass>;

  namespace AdaptiveFragmentChannelMixin {
    type BaseClass = typeof AnyPIXIShader | typeof AnyPIXIFilter;
  }

  /**
   * This class defines an interface which all shaders utilize
   */
  abstract class AbstractBaseShader extends BaseShaderMixin(PIXI.Shader) {
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
     * @remarks This is abstract, subclasses must implement it.
     */
    static fragmentShader: string | ((arg0: never, ...args: never[]) => string);

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
    static create(defaultUniforms?: AbstractBaseShader.Uniforms): AbstractBaseShader;

    /**
     * Reset the shader uniforms back to their provided default values
     * @internal
     */
    protected reset(): void;
  }
  /**
   * An abstract filter which provides a framework for reusable definition
   */
  class AbstractBaseFilter extends BaseShaderMixin(PIXI.Filter) {
    /**
     * The default uniforms used by the filter
     * @defaultValue `undefined`
     */
    static defaultUniforms: AbstractBaseShader.Uniforms | undefined;

    /**
     * The fragment shader which renders this filter.
     * @defaultValue `undefined`
     */
    static fragmentShader: string | ((arg0: never, ...args: never[]) => string) | undefined;

    /**
     * The vertex shader which renders this filter.
     * @defaultValue `undefined`
     */
    static vertexShader: string;

    /**
     * A factory method for creating the filter using its defined default values.
     * @param uniforms - Initial uniform values which override filter defaults
     * @returns The constructed AbstractFilter instance.
     */
    static create(uniforms?: AbstractBaseShader.Uniforms): AbstractBaseFilter;

    /**
     * Always target the resolution of the render texture or renderer
     */
    get resolution(): number;

    set resolution(value);

    /**
     * Always target the MSAA level of the render texture or renderer
     * @privateRemarks Foundry overrides here as a getter with a do-nothing setter
     */
    multisample: PIXI.MSAA_QUALITY;
  }
  /**
   * A simple shader to emulate a PIXI.Sprite with a PIXI.Mesh (but faster!)
   */
  class BaseSamplerShader extends AbstractBaseShader {
    static override create<T extends BaseSamplerShader>(
      this: ConstructorOf<T>,
      defaultUniforms?: AbstractBaseShader.Uniforms | undefined,
    ): T;

    /**
     * The plugin name associated for this instance.
     */
    pluginName: (typeof BaseSamplerShader)["classPluginName"];

    /**
     * The named batch sampler plugin that is used by this shader, or null if no batching is used.
     * @defaultValue `"batch"`
     */
    static classPluginName: string | null;

    /**
     * Activate or deactivate this sampler. If set to false, the batch rendering is redirected to "batch".
     * Otherwise, the batch rendering is directed toward the instance pluginName (might be null)
     * @defaultValue `true`
     */
    get enabled(): boolean;

    set enabled(enabled);

    /**
     * Contrast adjustment
     * @defaultValue
     * ```js
     * `// Computing contrasted color
     * if ( contrast != 0.0 ) {
     * changedColor = (changedColor - 0.5) * (contrast + 1.0) + 0.5;
     * }`
     * ```
     */
    static CONTRAST: string;

    /**
     * Saturation adjustment
     * @defaultValue
     * ```js
     * `// Computing saturated color
     * if ( saturation != 0.0 ) {
     *  vec3 grey = vec3(perceivedBrightness(changedColor));
     *  changedColor = mix(grey, changedColor, 1.0 + saturation);
     * }`
     * ```
     */
    static SATURATION: string;

    /**
     * Exposure adjustment.
     * @defaultValue
     * ```js
     * `if ( exposure != 0.0 ) {
     *   changedColor *= (1.0 + exposure);
     * }`
     * ```
     */
    static EXPOSURE: string;

    /**
     * The adjustments made into fragment shaders.
     * @defaultValue
     * ```js
     * `vec3 changedColor = baseColor.rgb;
     * ${this.CONTRAST}
     * ${this.SATURATION}
     * ${this.EXPOSURE}
     * baseColor.rgb = changedColor;`
     * ```
     */
    static get ADJUSTMENTS(): string;

    /**
     * @defaultValue
     * ```js
     * `precision ${PIXI.settings.PRECISION_VERTEX} float;
     * attribute vec2 aVertexPosition;
     * attribute vec2 aTextureCoord;
     * uniform mat3 projectionMatrix;
     * varying vec2 vUvs;

     * void main() {
     *   vUvs = aTextureCoord;
     *   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
     * }`
     * ```
     */
    static override vertexShader: string;

    static override fragmentShader: string;

    /**
     * Batch default vertex
     */
    static batchVertexShader: string;

    /**
     * Batch default fragment
     */
    static batchFragmentShader: string;

    /**
     * @defaultValue
     * ```javascript
     * {
     *  tintAlpha: [1, 1, 1, 1],
     *  sampler: 0
     * };
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * Batch geometry associated with this sampler.
     */
    static batchGeometry: typeof PIXI.BatchGeometry;

    /**
     * The size of a vertice with all its packed attributes.
     * @defaultValue `6`
     */
    static batchVertexSize: number;

    /**
     * Pack interleaved geometry custom function.
     */
    protected static _packInterleavedGeometry: (
      element: PIXI.IBatchableElement,
      attributeBuffer: PIXI.ViewableBuffer,
      indexBuffer: Uint16Array,
      aIndex: number,
      iIndex: number,
    ) => void | undefined;

    /**
     * A prerender function happening just before the batch renderer is flushed.
     */
    protected static _preRenderBatch(): (batchRenderer: typeof BatchRenderer) => void;

    /**
     * A function that returns default uniforms associated with the batched version of this sampler.
     * @remarks Foundry annotated this as abstract
     */
    static batchDefaultUniforms:
      | ((maxTextures: AbstractBaseShader.UniformValue) => AbstractBaseShader.Uniforms)
      | undefined;

    /**
     * The number of reserved texture units for this shader that cannot be used by the batch renderer.
     * @defaultValue `0`
     */
    static reservedTextureUnits: number;

    /**
     * Initialize the batch geometry with custom properties.
     * @remarks Foundry annotated this as abstract
     */
    static initializeBatchGeometry(): void;

    /**
     * The batch renderer to use.
     */
    static batchRendererClass: typeof BatchRenderer;

    /**
     * The batch generator to use.
     */
    static batchShaderGeneratorClass: typeof BatchShaderGenerator;
    /**
     * Create a batch plugin for this sampler class.
     * @returns - The batch plugin class linked to this sampler class.
     */
    static createPlugin<T extends typeof BaseSamplerShader, BatchPlugin extends T["batchRendererClass"]>(
      this: ConstructorOf<T>,
    ): BatchPlugin;

    /**
     * Register the plugin for this sampler.
     */
    static registerPlugin(): void;

    /**
     * Perform operations which are required before binding the Shader to the Renderer.
     * @param mesh - The mesh linked to this shader.
     * @internal
     */
    protected _preRender(mesh: SpriteMesh): void;
  }
}

declare abstract class AnyPIXIShader extends PIXI.Shader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyPIXIFilter extends PIXI.Filter {
  constructor(arg0: never, ...args: never[]);
}
