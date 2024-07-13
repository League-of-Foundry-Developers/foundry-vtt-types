export {};

declare global {
  /**
   * The shader used by {@link RegionMesh}.
   */
  class RegionShader extends AbstractBaseShader {
    static override vertexShader: string;

    static override fragmentShader: string | ((...args: any[]) => string);

    static override defaultUniforms: AbstractBaseShader.Uniforms;

    protected override _preRender(mesh: PIXI.DisplayObject, renderer: PIXI.Renderer): void;
  }
}
