export {};

declare abstract class AnyAbstractBaseFilter extends AbstractBaseFilter {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace AbstractBaseFilter {
    type AnyConstructor = typeof AnyAbstractBaseFilter;

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
     * @param initialUniforms - Initial uniform values which override filter defaults
     * @returns The constructed AbstractFilter[sic] instance.
     */
    static create<ThisType extends AbstractBaseFilter.AnyConstructor>(
      this: ThisType,
      initialUniforms?: AbstractBaseShader.Uniforms,
    ): InstanceType<ThisType>;
  }
}
