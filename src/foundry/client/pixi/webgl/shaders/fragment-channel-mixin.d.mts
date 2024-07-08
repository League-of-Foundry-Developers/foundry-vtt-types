import type { Mixin } from "../../../../../types/utils.d.mts";

export {};

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
  namespace AdaptiveFragmentChannel {
    type Channel = "r" | "g" | "b";
  }
  function AdaptiveFragmentChannelMixin<BaseClass extends typeof PIXI.Shader | typeof PIXI.Filter>(
    ShaderClass: BaseClass,
  ): Mixin<typeof AdaptiveFragmentChannelMixinClass, BaseClass>;
}
