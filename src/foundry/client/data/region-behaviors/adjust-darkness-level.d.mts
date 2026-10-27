import type RegionBehaviorType from "./base.d.mts";
import type { Brand, DeepPartial } from "#utils";
import type { Document, TypeDataModel } from "#common/abstract/_module.d.mts";
import fields = foundry.data.fields;
import type { InvertObject } from "#common/utils/helpers.d.mts";

declare namespace AdjustDarknessLevelRegionBehaviorType {
  type MODES = Brand<number, "AdjustDarknessLevelRegionBehaviorType.MODES">;

  interface Modes extends Readonly<{
    /**
     * Override the darkness level with the modifier.
     */
    OVERRIDE: 0 & MODES;

    /**
     * Brighten the darkness level: `darknessLevel * (1 - modifier)`
     */
    BRIGHTEN: 1 & MODES;

    /**
     * Darken the darkness level: `1 - (1 - darknessLevel) * (1 - modifier)`.
     */
    DARKEN: 2 & MODES;
  }> {}

  interface Schema extends foundry.data.fields.DataSchema {
    mode: fields.NumberField<{
      required: true;
      blank: false;
      choices: InvertObject<Modes>;
      initial: typeof AdjustDarknessLevelRegionBehaviorType.MODES.OVERRIDE;
      validationError: string;
    }>;

    modifier: fields.AlphaField<{ initial: 0; step: 0.01 }>;
  }

  interface OnUpdateData extends DeepPartial<
    TypeDataModel.ParentAssignmentType<Schema, RegionBehavior.Implementation>
  > {}
}

/**
 * The data model for a behavior that allows to adjust the darkness level within the Region.
 */
declare class AdjustDarknessLevelRegionBehaviorType extends RegionBehaviorType<AdjustDarknessLevelRegionBehaviorType.Schema> {
  /** @defaultValue `["BEHAVIOR.TYPES.adjustDarknessLevel", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  /**
   * Darkness level behavior modes.
   */
  static get MODES(): AdjustDarknessLevelRegionBehaviorType.Modes;

  static override defineSchema(): AdjustDarknessLevelRegionBehaviorType.Schema;

  /**
   * @defaultValue
   * ```js
   * {
   *   [REGION_EVENTS.BEHAVIOR_VIEWED]: AdjustDarknessLevelRegionBehaviorType.#onBehaviorViewed,
   *   [REGION_EVENTS.BEHAVIOR_UNVIEWED]: AdjustDarknessLevelRegionBehaviorType.#onBehaviorUnviewed,
   *   [REGION_EVENTS.REGION_BOUNDARY]: AdjustDarknessLevelRegionBehaviorType.#onRegionBoundaryOrAnimation,
   *   [REGION_EVENTS.REGION_ANIMATION]: AdjustDarknessLevelRegionBehaviorType.#onRegionBoundaryOrAnimation
   * }
   * ```
   */
  static override events: Record<string, RegionBehaviorType.EventBehaviorStaticHandler>;

  /** @remarks Pushes `mode` and `modifier` to this behavior's meshes if `system` changed and it is viewed. */
  protected override _onUpdate(
    changed: AdjustDarknessLevelRegionBehaviorType.OnUpdateData,
    options: Document.Database.OnUpdateOptionsForName<"RegionBehavior">,
    userId: string,
  ): void;

  static #AdjustDarknessLevelRegionBehaviorType: true;
}

export default AdjustDarknessLevelRegionBehaviorType;
