export {};

declare abstract class AnyRegionShader extends RegionShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace RegionShader {
    type AnyConstructor = typeof AnyRegionShader;
  }

  /**
   * The shader used by {@link RegionMesh}.
   */
  class RegionShader extends AbstractBaseShader {
    static override vertexShader: string;

    static override fragmentShader: AbstractBaseShader.FragmentShader;

    /**
     * @defaultValue
     * ```js
     * {
     *   canvasDimensions: [1, 1],
     *   sceneDimensions: [0, 0, 1, 1],
     *   screenDimensions: [1, 1],
     *   tintAlpha: [1, 1, 1, 1]
     * }
     * ```
     */
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    protected override _preRender(mesh: PIXI.DisplayObject, renderer: PIXI.Renderer): void;
  }
}
