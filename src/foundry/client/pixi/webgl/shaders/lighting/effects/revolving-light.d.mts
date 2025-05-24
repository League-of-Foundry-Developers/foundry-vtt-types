import type { Identity } from "#utils";

declare global {
  /**
   * Revolving animation coloration shader
   */
  class RevolvingColorationShader extends AdaptiveColorationShader {
    /**
     * @defaultValue `true`
     */
    static override forceDefaultColor: boolean;

    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *   ...super.defaultUniforms,
     *   angle: 0,
     *   gradientFade: 0.15,
     *   beamLength: 1
     * }
     * ```
     */
    static defaultUniforms: AbstractBaseShader.Uniforms;
  }

  namespace RevolvingColorationShader {
    interface Any extends AnyRevolvingColorationShader {}
    interface AnyConstructor extends Identity<typeof AnyRevolvingColorationShader> {}
  }
}

declare abstract class AnyRevolvingColorationShader extends RevolvingColorationShader {
  constructor(...args: never);
}
