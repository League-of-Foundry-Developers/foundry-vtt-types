import type RegionBehaviorType from "./base.d.mts";
import type { ConcreteKeys, DeepPartial } from "#utils";
import type { Document, TypeDataModel } from "#common/abstract/_module.d.mts";
import type { TerrainData } from "../terrain-data.d.mts";
import fields = foundry.data.fields;

declare namespace ModifyMovementCostRegionBehaviorType {
  /** The difficulty of a single movement action. */
  type DifficultyField = fields.NumberField<{
    required: true;
    nullable: true;
    initial: 1;
    step: 0.25;
    min: 0;
    max: 5;
    label: string;
    hint: string;
  }>;

  /**
   * @privateRemarks Only movement actions that configure neither `terrainAction` nor `deriveTerrainDifficulty` get a
   * registered field; the difficulty of the remaining actions is derived in `prepareBaseData`.
   */
  type DifficultiesSchema = {
    [Action in ConcreteKeys<CONFIG.Token.Movement.Actions>]: DifficultyField;
  };

  interface Schema extends foundry.data.fields.DataSchema {
    /** The difficulty of each movement action */
    difficulties: fields.SchemaField<DifficultiesSchema>;
  }

  interface OnUpdateData extends DeepPartial<
    TypeDataModel.ParentAssignmentType<Schema, RegionBehavior.Implementation>
  > {}
}

/**
 * The data model for a behavior that allows to modify the movement cost within the Region.
 */
declare class ModifyMovementCostRegionBehaviorType extends RegionBehaviorType<ModifyMovementCostRegionBehaviorType.Schema> {
  /** @defaultValue `["BEHAVIOR.TYPES.modifyMovementCost", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): ModifyMovementCostRegionBehaviorType.Schema;

  /**
   * @defaultValue
   * ```js
   * {
   *   [REGION_EVENTS.BEHAVIOR_VIEWED]: ModifyMovementCostRegionBehaviorType.#onBehaviorViewed,
   *   [REGION_EVENTS.BEHAVIOR_UNVIEWED]: ModifyMovementCostRegionBehaviorType.#onBehaviorUnviewed,
   *   [REGION_EVENTS.REGION_BOUNDARY]: ModifyMovementCostRegionBehaviorType.#onRegionBoundary
   * }
   * ```
   */
  static override events: Record<string, RegionBehaviorType.EventBehaviorStaticHandler>;

  /**
   * @remarks Derives the difficulty of every movement action that has no registered field from the difficulties in
   * `_source`.
   */
  override prepareBaseData(): void;

  /** @remarks Recalculates the planned movement paths when the behavior is viewed and `system` changed. */
  protected override _onUpdate(
    changed: ModifyMovementCostRegionBehaviorType.OnUpdateData,
    options: Document.Database.OnUpdateOptionsForName<"RegionBehavior">,
    userId: string,
  ): void;

  protected override _getTerrainEffects(
    token: TokenDocument.Implementation,
    segment: RegionBehaviorType.MovementSegment,
    options?: RegionBehaviorType.GetTerrainEffectsOptions,
  ): TerrainData.TerrainEffect[];

  static #ModifyMovementCostRegionBehaviorType: true;
}

export default ModifyMovementCostRegionBehaviorType;
