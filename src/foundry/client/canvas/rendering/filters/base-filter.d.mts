import type { AnyObject, FixedInstanceType, Identity } from "#utils";
import type { AbstractBaseShader } from "../shaders/_module.mjs";
import type { BaseShaderMixin } from "../mixins/_module.mjs";

/**
 * An abstract filter which provides a framework for reusable definition
 */
declare class AbstractBaseFilter extends BaseShaderMixin(PIXI.Filter) {
  // fake type override
  static override get defaultUniforms(): AbstractBaseShader.Uniforms;

  static override create<ThisType extends AbstractBaseFilter.AnyConstructor>(
    this: ThisType,
    uniforms?: AbstractBaseShader.Uniforms,
    options?: AnyObject,
  ): FixedInstanceType<ThisType>;
}

declare namespace AbstractBaseFilter {
  interface Any extends AnyAbstractBaseFilter {}
  interface AnyConstructor extends Identity<typeof AnyAbstractBaseFilter> {}
}

export default AbstractBaseFilter;

declare abstract class AnyAbstractBaseFilter extends AbstractBaseFilter {
  constructor(...args: never);
}
