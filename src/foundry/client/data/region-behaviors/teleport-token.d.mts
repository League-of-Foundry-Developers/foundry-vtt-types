import type RegionBehaviorType from "./base.d.mts";
import type { DataField } from "#common/data/fields.d.mts";
import type { MaybePromise } from "#utils";
import fields = foundry.data.fields;

declare namespace TeleportTokenRegionBehaviorType {
  /** Custom teleporation dialogs */
  interface DialogSchema extends foundry.data.fields.DataSchema {
    revealed: fields.StringField<{ required: true; nullable: true; blank: false }>;

    unrevealed: fields.StringField<{ required: true; nullable: true; blank: false }>;
  }

  /** Transition options */
  interface TransitionSchema extends foundry.data.fields.DataSchema {
    type: fields.StringField<{ required: true; nullable: true; blank: false; initial: null }>;

    duration: fields.NumberField<{
      required: true;
      nullable: false;
      integer: true;
      initial: 1500;
      min: 500;
      max: 10000;
      step: 100;
    }>;
  }

  interface Schema extends foundry.data.fields.DataSchema {
    /** The destination(s) Region the Token is teleported to. */
    destinations: fields.SetField<fields.DocumentUUIDField<{ type: "Region"; nullable: false; relative: true }>>;

    /** The placement of the Token within the destination Region. */
    placement: fields.StringField<{
      required: true;
      initial: "random";
      choices: {
        random: "BEHAVIOR.TYPES.teleportToken.PLACEMENTS.random.label";
        center: "BEHAVIOR.TYPES.teleportToken.PLACEMENTS.center.label";
        relative: "BEHAVIOR.TYPES.teleportToken.PLACEMENTS.relative.label";
      };
    }>;

    /** Snap the Token destination position? */
    snap: fields.BooleanField<{ initial: true }>;

    /** Show teleportation confirmation dialog? */
    choice: fields.BooleanField;

    /** Are the destinations revealed? */
    revealed: fields.BooleanField;

    /** Custom teleporation dialogs */
    dialog: fields.SchemaField<DialogSchema>;

    /** Transition options */
    transition: fields.SchemaField<TransitionSchema>;
  }

  interface ConfirmQueryData {
    behaviorUuid: string;

    tokenUuid: string;
  }
}

/**
 * The data model for a behavior that teleports Token that enter the Region to a preset destination Region.
 */
declare class TeleportTokenRegionBehaviorType extends RegionBehaviorType<TeleportTokenRegionBehaviorType.Schema> {
  /** @defaultValue `["BEHAVIOR.TYPES.teleportToken", "BEHAVIOR.TYPES.base"]` */
  static override LOCALIZATION_PREFIXES: string[];

  static override defineSchema(): TeleportTokenRegionBehaviorType.Schema;

  /**
   * @defaultValue
   * ```js
   * {
   *   [REGION_EVENTS.TOKEN_MOVE_IN]: TeleportTokenRegionBehaviorType.#onTokenMoveIn
   * }
   * ```
   */
  static override events: Record<string, RegionBehaviorType.EventBehaviorStaticHandler>;

  /**
   * @remarks This implementation is synchronous, despite returning `MaybePromise<void>` to match the  base signature.
   */
  protected override _handleRegionEvent(event: RegionDocument.RegionEvent): MaybePromise<void>;

  override prepareBaseData(): void;

  /**
   * The query handler for teleporation confirmation.
   * @internal
   */
  static _confirmQuery(queryData: TeleportTokenRegionBehaviorType.ConfirmQueryData): Promise<boolean>;

  /** @remarks Migrates the deprecated `destination` field to `destinations`. */
  static override migrateData(source: object, options?: DataField.CleanOptions): object;

  /**
   * @deprecated "You are accessing TeleportTokenRegionBehaviorType#destination which has been migrated to
   * TeleportTokenRegionBehaviorType#destinations" (since v14, until v16)
   */
  get destination(): string | null;

  #TeleportTokenRegionBehaviorType: true;
  static #TeleportTokenRegionBehaviorTypeStatic: true;
}

export default TeleportTokenRegionBehaviorType;
