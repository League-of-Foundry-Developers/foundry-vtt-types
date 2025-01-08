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
     */
    mode: foundry.data.regionBehaviors.AdjustDarknessLevelRegionBehaviorType.Modes;

    /**
     * The darkness level modifier.
     * @defaultValue `0`
     */
    modifier: number;

    /**
     * Current darkness level of this mesh.
     */
    get darknessLevel(): number;

    protected override _preRender: AbstractBaseShader.PreRenderFunction;
  }

  /**
   * Render the RegionMesh with darkness level adjustments.
   */
  class AdjustDarknessLevelRegionShader extends AbstractDarknessLevelRegionShader {
    /**
     * @defaultValue
     * ```
     *  `
     *   precision ${PIXI.settings.PRECISION_FRAGMENT} float;
     *
     *   uniform sampler2D depthTexture;
     *   uniform float darknessLevel;
     *   uniform float top;
     *   uniform float bottom;
     *   uniform vec4 tintAlpha;
     *   varying vec2 vScreenCoord;
     *
     *   void main() {
     *     vec2 depthColor = texture2D(depthTexture, vScreenCoord).rg;
     *     float depth = step(depthColor.g, top) * step(bottom, (254.5 / 255.0) - depthColor.r);
     *     gl_FragColor = vec4(darknessLevel, 0.0, 0.0, 1.0) * tintAlpha * depth;
     *   }
     *  `
     * ```
     */
    static override fragmentShader: string;

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

    protected override _preRender: AbstractBaseShader.PreRenderFunction;
  }

  /**
   * Render the RegionMesh with darkness level adjustments.
   */
  class IlluminationDarknessLevelRegionShader extends AbstractDarknessLevelRegionShader {
    /**
     * @defaultValue
     * ```
     *  `
     *   precision ${PIXI.settings.PRECISION_FRAGMENT} float;
     *
     *   uniform sampler2D depthTexture;
     *   uniform float top;
     *   uniform float bottom;
     *   uniform vec4 tintAlpha;
     *   varying vec2 vScreenCoord;
     *
     *   void main() {
     *     vec2 depthColor = texture2D(depthTexture, vScreenCoord).rg;
     *     float depth = step(depthColor.g, top) * step(bottom, (254.5 / 255.0) - depthColor.r);
     *     gl_FragColor = vec4(1.0) * tintAlpha * depth;
     *   }
     *  `
     * ```
     */
    static override fragmentShader: string;
  }
}
