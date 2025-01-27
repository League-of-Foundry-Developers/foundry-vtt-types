import type { AnyObject, Mixin, ShapeWithIndexSignature } from "fvtt-types/utils";

declare class AdaptiveFragmentChannel {
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
    AdaptiveFragmentChannel.ConcreteCreateOptions,
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
  function AdaptiveFragmentChannelMixin<BaseClass extends PIXI.Shader.AnyConstructor | PIXI.Filter.AnyConstructor>(
    ShaderClass: BaseClass,
  ): Mixin<typeof AdaptiveFragmentChannel, BaseClass>;

  namespace AdaptiveFragmentChannel {
    // Filter extends Shader, so Shader is the broadest option
    type AnyMixed = ReturnType<typeof AdaptiveFragmentChannelMixin<PIXI.Shader.AnyConstructor>>;
    type AnyConstructor = typeof AnyAdaptiveFragmentChannel;

    type Channel = "r" | "g" | "b";

    interface ConcreteCreateOptions {
      channel?: AdaptiveFragmentChannel.Channel | undefined;
    }
  }
}

declare abstract class AnyAdaptiveFragmentChannel extends AdaptiveFragmentChannel {
  constructor(arg0: never, ...args: never[]);
}
