import type { AnyObject, FixedInstanceType, Mixin, ShapeWithIndexSignature } from "fvtt-types/utils";

declare class AdaptiveFragmentChannel {
  /** @privateRemarks All mixin classses should accept anything for its constructor. */
  constructor(...args: any[]);

  /**
   * The fragment shader which renders this filter.
   * A subclass of AdaptiveFragmentChannelMixin must implement the fragmentShader static field.
   * @defaultValue `null`
   */
  static adaptiveFragmentShader: ((channel: AdaptiveFragmentChannelMixin.Channel) => string) | null;

  /**
   * A factory method for creating the filter using its defined default values
   * @param options - Options which affect filter construction
   */
  //TODO: See if we can get this to return the mixed shader class, as it calls `super.create()`
  static create<T extends AnyObject>({
    /**
     * A color channel to target for masking.
     * @defaultValue `r`
     */
    channel,
    /**
     * Initial uniforms provided to the filter
     */
    ...uniforms
  }?: ShapeWithIndexSignature<
    T,
    AdaptiveFragmentChannelMixin.ConcreteCreateOptions,
    string,
    AbstractBaseShader.UniformValue
  >): PIXI.Shader | PIXI.Filter;
}

declare global {
  /**
   * A mixin wich decorates a shader or filter and construct a fragment shader according to a choosen channel.
   * @param ShaderClass - The parent ShaderClass class being mixed.
   * @returns A Shader/Filter subclass mixed with AdaptiveFragmentChannelMixin.
   */
  function AdaptiveFragmentChannelMixin<BaseClass extends AdaptiveFragmentChannelMixin.BaseClass>(
    ShaderClass: BaseClass,
  ): Mixin<typeof AdaptiveFragmentChannel, BaseClass>;

  namespace AdaptiveFragmentChannelMixin {
    /** @privateRemarks Can't extend `AnyMixedConstructor` if it's using the `BaseClass` union; `PIXI.Shader` is the parent of `Filter`, so it's used instead */
    type AnyMixedConstructor = ReturnType<typeof AdaptiveFragmentChannelMixin<PIXI.Shader.AnyConstructor>>;
    interface AnyMixed extends FixedInstanceType<AnyMixedConstructor> {}

    type BaseClass = PIXI.Shader.AnyConstructor | PIXI.Filter.AnyConstructor;

    type Channel = "r" | "g" | "b";

    interface ConcreteCreateOptions {
      channel?: AdaptiveFragmentChannelMixin.Channel | undefined;
    }
  }
}
