export {};

declare global {
  namespace AbstractBaseFilter {
    type FragmentShader = AbstractBaseShader.FragmentShader | undefined;
  }
  /**
   * An abstract filter which provides a framework for reusable definition
   */
  class AbstractBaseFilter extends BaseShaderMixin(PIXI.Filter) {
    /**
     * The default uniforms used by the filter
     * @defaultValue `{}`
     */
    static defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * The fragment shader which renders this filter.
     * @defaultValue `undefined`
     */
    static fragmentShader: AbstractBaseFilter.FragmentShader;

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
  }
}
