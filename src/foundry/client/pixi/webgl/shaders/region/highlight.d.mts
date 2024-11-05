export {};

declare abstract class AnyHighlightRegionShader extends HighlightRegionShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace HighlightRegionShader {
    type AnyConstructor = typeof AnyHighlightRegionShader;
  }

  /**
   * Shader for the Region highlight.
   */
  class HighlightRegionShader extends RegionShader {
    static override vertexShader: string;

    static override fragmentShader: string;

    /**
     * @defaultValue
     * ```js
     * {
     *   ...super.defaultUniforms,
     *   resolution: 1,
     *   hatchEnabled: false,
     *   hatchThickness: 1
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    protected override _preRender: AbstractBaseShader.PreRenderFunction;
  }
}
