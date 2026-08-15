import type { Identity } from "#utils";
import type { AbstractBaseShader, RegionShader } from "../_module.mjs";

/**
 * Abstract shader used for Adjust Darkness Level region behavior.
 * @internal
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
  protected static override _createFragmentShader(): string;

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
  protected static override _createFragmentShader(): string;
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
