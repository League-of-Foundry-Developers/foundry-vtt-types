import type { Identity } from "#utils";
import type { AbstractBaseFilter } from "./_module.d.mts";
import type { AbstractBaseShader } from "../shaders/_module.mjs";

/**
 * Invisibility effect filter for placeables.
 */
declare class InvisibilityFilter extends AbstractBaseFilter {
  static override fragmentShader: string;

  /**
   * @defaultValue
   * ```js
   * {
   *   uSampler: null,
   *   color: [0.5, 1, 1]
   * }
   * ```
   */
  static override defaultUniforms: AbstractBaseShader.Uniforms;
}

declare namespace InvisibilityFilter {
  interface Any extends AnyInvisibilityFilter {}
  interface AnyConstructor extends Identity<typeof AnyInvisibilityFilter> {}
}

export default InvisibilityFilter;

declare abstract class AnyInvisibilityFilter extends InvisibilityFilter {
  constructor(...args: never);
}
