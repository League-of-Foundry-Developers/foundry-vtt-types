/**
 * This class defines an interface for masked custom filters
 */
declare abstract class AbstractBaseMaskFilter extends PIXI.Filter {
  /**
   * The default vertex shader used by all instances of AbstractBaseMaskFilter
   */
  static vertexShader: string;

  /**
   * The fragment shader which renders this filter.
   * A subclass of AbstractBaseMaskFilter must implement the fragmentShader(channel) static field.
   */
  static fragmentShader: ((channel: "r" | "g" | "b") => string) | null;

  /**
   * A factory method for creating the filter using its defined default values
   * @param defaultUniforms - Initial uniforms provided to the filter
   *                          (default: `{}`)
   * @param channel         - A color channel to target for masking.
   *                          (default: `"r"`)
   */
  static create<T extends AbstractBaseMaskFilter>(
    this: ConstructorOf<T>,
    defaultUniforms?: ConstructorParameters<typeof PIXI.Filter>[2],
    channel?: "r" | "g" | "b"
  ): T;

  override apply(
    filterManager: PIXI.systems.FilterSystem,
    input: PIXI.RenderTexture,
    output: PIXI.RenderTexture,
    clear: PIXI.CLEAR_MODES,
    currentState: any
  ): void;
}

/**
 * A filter used to control channels intensity using an externally provided mask texture.
 * The mask channel used must be provided at filter creation.
 * Contributed by SecretFire#4843
 */
declare class InverseOcclusionMaskFilter extends AbstractBaseMaskFilter {
  static fragmentShader(channel: "r" | "g" | "b"): string;

  /**
   * @param defaultUniforms - (default: `{}`)
   * @param channel  - (default `"r"`)
   */
  static create<T extends InverseOcclusionMaskFilter>(
    this: ConstructorOf<T>,
    defaultUniforms?: ConstructorParameters<typeof PIXI.Filter>[2],
    channel?: "r" | "g" | "b"
  ): T;
}

/**
 * An abstract filter which provides a framework for reusable definition
 */
declare abstract class AbstractFilter extends PIXI.Filter {
  /**
   * The default uniforms used by the filter
   * @defaultValue `{}`
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;

  /**
   * The fragment shader which renders this filter.
   * @defaultValue `undefined`
   * @remarks This is a function in {@link GlowFilter}. See https://gitlab.com/foundrynet/foundryvtt/-/issues/6937
   */
  static fragmentShader: string | ((quality: number, distance: number) => string) | undefined;

  /**
   * The vertex shader which renders this filter.
   * @defaultValue `undefined`
   */
  static vertexShader: string | undefined;

  /**
   * A factory method for creating the filter using its defined default values
   * @param uniforms - (default: `{}`)
   */
  static create(uniforms: AbstractBaseShader.Uniforms): AbstractFilter;

  /**
   * Always target the resolution of the render texture or renderer
   */
  // @ts-expect-error this is a property on PIXI.Filter
  get resolution(): number;
  set resolution(value: number);

  /**
   * Always target the MSAA level of the render texture or renderer
   */
  get multisample(): PIXI.MSAA_QUALITY;
  set multisample(value: PIXI.MSAA_QUALITY);
}

/**
 * A filter which forces all non-transparent pixels to a specific color and transparency.
 */
declare class ForceColorFilter extends AbstractFilter {
  /**
   * @defaultValue
   * ```typescript
   * {
   *   color: [1, 1, 1],
   *   alpha: 1.0
   * }
   * ```
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;

  static fragmentShader: string;
}

/**
 * A filter which is rendering explored color according to FoW intensity.
 */
declare class FogColorFilter extends AbstractFilter {
  /**
   * @defaultValue
   * ```typescript
   * {
   *   exploredColor: [1, 1, 1]
   * }
   * ```
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;

  static fragmentShader: string;
}

/**
 * This filter turns pixels with an alpha channel &lt; alphaThreshold in transparent pixels
 * Then, optionally, it can turn the result in the chosen color (default: pure white).
 * The alpha [threshold,1] is re-mapped to [0,1] with an hermite interpolation slope to prevent pixelation.
 */
declare class RoofMaskFilter extends AbstractFilter {
  /**
   * @defaultValue
   * ```typescript
   * {
   *   alphaThreshold: 0.75,
   *   turnToColor: false,
   *   color: [1, 1, 1]
   * }
   * ```
   */
  static defaultUniforms: AbstractBaseShader.Uniforms;

  static fragmentShader: string;
}

/**
 * A filter which implements an inner or outer glow around the source texture.
 * Incorporated from https://github.com/pixijs/filters/tree/main/filters/glow
 */
declare class GlowFilter extends AbstractFilter {
  /**
   * @defaultValue
   * ```typescript
   * {
   *   distance: 10,
   *   innerStrength: 0,
   *   glowColor: [1, 1, 1, 1],
   *   quality: 0.1,
   * }
   * ```
   */
  static override defaultUniforms: AbstractBaseShader.Uniforms & { distance: number; quality: number };

  /**
   * @remarks This could change, see https://gitlab.com/foundrynet/foundryvtt/-/issues/6937
   */
  static override fragmentShader(quality: number, distance: number): string;

  static override vertexShader: string;

  static override create(uniforms: AbstractBaseShader.Uniforms): GlowFilter;
}
