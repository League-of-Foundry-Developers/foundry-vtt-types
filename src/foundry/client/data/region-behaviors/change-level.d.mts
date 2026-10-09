import type RegionBehaviorType from "./base.d.mts";
import type DataModel from "#common/abstract/data.d.mts";
import type { RemoveIndexSignatures } from "#utils";
import fields = foundry.data.fields;

declare namespace ChangeLevelRegionBehaviorType {
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * @remarks The configured movement actions, minus `displace`, which never triggers a level change.
   */
  type MovementActionChoices = () => Omit<RemoveIndexSignatures<CONFIG.Token.Movement.Actions>, "displace">;

  interface Schema extends foundry.data.fields.DataSchema {
    movementActions: fields.SetField<
      fields.StringField<{
        required: true;
        blank: false;
        nullable: false;
        initial: undefined;
        choices: MovementActionChoices;
      }>
    >;
  }
}

/**
 * The data model for a behavior that prompts to change the level of Tokens that enter the Region.
 */
declare class ChangeLevelRegionBehaviorType extends RegionBehaviorType<ChangeLevelRegionBehaviorType.Schema> {
  /** @defaultValue `["BEHAVIOR.TYPES.changeLevel", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): ChangeLevelRegionBehaviorType.Schema;

  /**
   * @remarks Drops any `movementActions` entries that are not keys of
   * {@linkcode CONFIG.Token.movement.actions}, guarding against actions removed since the behavior was created.
   */
  protected override _initializeSource(
    data: this | ChangeLevelRegionBehaviorType.CreateData,
    options?: DataModel.InitializeSourceOptions,
  ): ChangeLevelRegionBehaviorType.Source;

  /**
   * @defaultValue
   * ```js
   * {
   *   [REGION_EVENTS.TOKEN_MOVE_IN]: ChangeLevelRegionBehaviorType.#onTokenMoveIn,
   *   [REGION_EVENTS.TOKEN_EXIT]: ChangeLevelRegionBehaviorType.#onTokenExit
   * }
   * ```
   */
  static override events: Record<string, RegionBehaviorType.EventBehaviorStaticHandler>;

  #ChangeLevelRegionBehaviorType: true;
  static #ChangeLevelRegionBehaviorTypeStatic: true;
}

export default ChangeLevelRegionBehaviorType;
