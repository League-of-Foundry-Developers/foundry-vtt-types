export {};

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
    type Any = AnyInvisibilityFilter;
    type AnyConstructor = typeof AnyInvisibilityFilter;
  }
}

declare abstract class AnyInvisibilityFilter extends InvisibilityFilter {
  constructor(arg0: never, ...args: never[]);
}
