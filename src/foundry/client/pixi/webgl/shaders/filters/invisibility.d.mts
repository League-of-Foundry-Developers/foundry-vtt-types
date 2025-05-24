import type { Identity } from "#utils";

declare global {
  /**
   * Invisibility effect filter for placeables.
   */
  class InvisibilityFilter extends AbstractBaseFilter {
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

  namespace InvisibilityFilter {
    interface Any extends AnyInvisibilityFilter {}
    interface AnyConstructor extends Identity<typeof AnyInvisibilityFilter> {}
  }
}

declare abstract class AnyInvisibilityFilter extends InvisibilityFilter {
  constructor(...args: never);
}
