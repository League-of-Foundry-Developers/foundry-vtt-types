export {};

declare global {
  /**
   * Abstract shader used for Adjust Darkness Level region behavior.
   * @remarks Foundry labeled as abstract
   */
  class AbstractDarknessLevelRegionShader extends RegionShader {
    static override defaultUniforms: AbstractBaseShader.Uniforms;

    /**
     * The darkness level adjustment mode.
     * @defaultValue `foundry.data.regionBehaviors.AdjustDarknessLevelRegionBehaviorType.MODES.OVERRIDE`
     * TODO: make into typeof... when referenced class is available
     */
    mode: number;

    /**
     * The darkness level modifier.
     * @defaultValue `0`
     */
    modifier: number;

    /**
     * Current darkness level of this mesh.
     */
    get darknessLevel(): number;

    protected override _preRender(mesh: PIXI.DisplayObject, renderer: PIXI.Renderer): void;
  }

  /**
   * Render the RegionMesh with darkness level adjustments.
   */
  class AdjustDarknessLevelRegionShader extends AbstractDarknessLevelRegionShader {
    static override fragmentShader: AbstractBaseShader.FragmentShader;

    static override defaultUniforms: AbstractBaseShader.Uniforms;

    protected override _preRender(mesh: PIXI.DisplayObject, renderer: PIXI.Renderer): void;
  }

  /**
   * Render the RegionMesh with darkness level adjustments.
   */
  class IlluminationDarknessLevelRegionShader extends AbstractDarknessLevelRegionShader {
    static override fragmentShader: AbstractBaseShader.FragmentShader;
  }
}
