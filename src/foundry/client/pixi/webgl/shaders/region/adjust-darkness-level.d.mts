export {};

declare abstract class AnyAbstractDarknessLevelRegionShader extends AbstractDarknessLevelRegionShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyAdjustDarknessLevelRegionShader extends AdjustDarknessLevelRegionShader {
  constructor(arg0: never, ...args: never[]);
}

declare abstract class AnyIlluminationDarknessLevelRegionShader extends IlluminationDarknessLevelRegionShader {
  constructor(arg0: never, ...args: never[]);
}

declare global {
  namespace AbstractDarknessLevelRegionShader {
    type AnyConstructor = typeof AnyAbstractDarknessLevelRegionShader;
  }

  namespace AdjustDarknessLevelRegionShader {
    type AnyConstructor = typeof AnyAdjustDarknessLevelRegionShader;
  }

  namespace IlluminationDarknessLevelRegionShader {
    type AnyConstructor = typeof AnyIlluminationDarknessLevelRegionShader;
  }
  /**
   * Abstract shader used for Adjust Darkness Level region behavior.
   * @remarks Foundry labeled as abstract
   */
  class AbstractDarknessLevelRegionShader extends RegionShader {
    /**
     * @defaultValue
     * ```js
     * {
     *   ...super.defaultUniforms,
     *   bottom: 0,
     *   top: 0,
     *   depthTexture: null
     * }
     * ```
     */
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
    /**
     * @defaultValue
     * ```js
     * {
     *   ...super.defaultUniforms,
     *   darknessLevel: 0
     * }
     * ```
     */
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
