import type { Identity } from "#utils";
import type { AbstractBaseShader, RegionShader } from "../_module.mjs";

/**
 * Abstract shader used for Adjust Darkness Level region behavior.
 */
declare abstract class AbstractDarknessLevelRegionShader extends RegionShader {
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
  mode: foundry.data.regionBehaviors.AdjustDarknessLevelRegionBehaviorType.MODES;

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

declare namespace AbstractDarknessLevelRegionShader {
  interface Any extends AnyAbstractDarknessLevelRegionShader {}
  interface AnyConstructor extends Identity<typeof AnyAbstractDarknessLevelRegionShader> {}
}

/**
 * Render the RegionMesh with darkness level adjustments.
 */
declare class AdjustDarknessLevelRegionShader extends AbstractDarknessLevelRegionShader {
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

declare namespace AdjustDarknessLevelRegionShader {
  interface Any extends AnyAdjustDarknessLevelRegionShader {}
  interface AnyConstructor extends Identity<typeof AnyAdjustDarknessLevelRegionShader> {}
}

/**
 * Render the RegionMesh with darkness level adjustments.
 */
declare class IlluminationDarknessLevelRegionShader extends AbstractDarknessLevelRegionShader {
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

declare namespace IlluminationDarknessLevelRegionShader {
  interface Any extends AnyIlluminationDarknessLevelRegionShader {}
  interface AnyConstructor extends Identity<typeof AnyIlluminationDarknessLevelRegionShader> {}
}

export { AbstractDarknessLevelRegionShader, AdjustDarknessLevelRegionShader, IlluminationDarknessLevelRegionShader };

declare abstract class AnyAbstractDarknessLevelRegionShader extends AbstractDarknessLevelRegionShader {
  constructor(...args: never);
}

declare abstract class AnyAdjustDarknessLevelRegionShader extends AdjustDarknessLevelRegionShader {
  constructor(...args: never);
}

declare abstract class AnyIlluminationDarknessLevelRegionShader extends IlluminationDarknessLevelRegionShader {
  constructor(...args: never);
}
