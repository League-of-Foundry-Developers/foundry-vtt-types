import type { DeepPartial } from "#utils";
import type { Document, TypeDataModel } from "#common/abstract/_module.d.mts";
import type RegionBehaviorType from "./base.d.mts";
import fields = foundry.data.fields;

declare namespace ApplyActiveEffectRegionBehaviorType {
  interface Schema extends foundry.data.fields.DataSchema {
    /** The Active Effects that are applied to Token within the Region. */
    effects: fields.SetField<fields.DocumentUUIDField<{ type: "ActiveEffect"; nullable: false }>>;
  }

  interface OnUpdateData extends DeepPartial<
    TypeDataModel.ParentAssignmentType<Schema, RegionBehavior.Implementation>
  > {}
}

/**
 * The data model for a behavior that applies Active Effects to Tokens within the Region.
 *
 * This is a behavior that applies the configured Active Effects to the Token's Actor when the Token enters the region.
 * Once the Token exists the Region, these Active Effects are removed from the Token's Actor.
 *
 * For example, this behavior could apply a Slowed effect in a blizzard region, or grant extra cover and concealment
 * in areas of tall grass.
 */
declare class ApplyActiveEffectRegionBehaviorType extends RegionBehaviorType<ApplyActiveEffectRegionBehaviorType.Schema> {
  /** @defaultValue `["BEHAVIOR.TYPES.applyActiveEffect", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): ApplyActiveEffectRegionBehaviorType.Schema;

  /**
   * @defaultValue
   * ```js
   * {
   *   [REGION_EVENTS.TOKEN_ENTER]: ApplyActiveEffectRegionBehaviorType.#onTokenEnter,
   *   [REGION_EVENTS.TOKEN_EXIT]: ApplyActiveEffectRegionBehaviorType.#onTokenExit
   * }
   * ```
   */
  static override events: Record<string, RegionBehaviorType.EventBehaviorStaticHandler>;

  /**
   * @remarks Recreates the effects of every Token within the Region when the behavior is active and `system`
   * changed.
   */
  protected override _onUpdate(
    changed: ApplyActiveEffectRegionBehaviorType.OnUpdateData,
    options: Document.Database.OnUpdateOptionsForName<"RegionBehavior">,
    userId: string,
  ): void;

  #ApplyActiveEffectRegionBehaviorType: true;
  static #ApplyActiveEffectRegionBehaviorTypeStatic: true;
}

export default ApplyActiveEffectRegionBehaviorType;
