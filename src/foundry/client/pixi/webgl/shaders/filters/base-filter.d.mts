import type { FixedInstanceType, Identity } from "fvtt-types/utils";

declare global {
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
    static fragmentShader: AbstractBaseShader.FragmentShaderFunction | string | undefined;

    /**
     * The vertex shader which renders this filter.
     * @defaultValue `undefined`
     */
    static vertexShader: string | undefined;

    /**
     * A factory method for creating the filter using its defined default values.
     * @param initialUniforms - Initial uniform values which override filter defaults
     * @returns The constructed AbstractFilter[sic] instance.
     */
    static create<ThisType extends AbstractBaseFilter.AnyConstructor>(
      this: ThisType,
      /**
       * @defaultValue `{}`
       */
      initialUniforms?: AbstractBaseShader.Uniforms | null,
    ): FixedInstanceType<ThisType>;
  }

  namespace AbstractBaseFilter {
    interface Any extends AnyAbstractBaseFilter {}
    interface AnyConstructor extends Identity<typeof AnyAbstractBaseFilter> {}
  }
}

declare abstract class AnyAbstractBaseFilter extends AbstractBaseFilter {
  constructor(...args: never);
}
