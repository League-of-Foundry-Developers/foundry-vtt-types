export {};

declare global {
  /**
   * Shader for the Region highlight.
   */
  class HighlightRegionShader extends RegionShader {
    static override vertexShader: string;

    static override fragmentShader: AbstractBaseShader.FragmentShader;

    static override defaultUniforms: AbstractBaseShader.Uniforms;

    protected override _preRender(mesh: PIXI.DisplayObject, renderer: PIXI.Renderer): void;
  }
}
