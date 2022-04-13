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
   */
  static fragmentShader: string | undefined;

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
