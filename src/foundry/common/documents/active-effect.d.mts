import type { InterfaceToObject } from "../../../types/helperTypes.d.mts";
import type { AnyObject, InexactPartial, Merge } from "../../../types/utils.mts";
import type Document from "../abstract/document.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type * as fields from "../data/fields.d.mts";
import type * as documents from "./_module.mts";

declare global {
  type ActiveEffectData = BaseActiveEffect.Properties;

  type EffectDurationData = BaseActiveEffect.Properties["duration"];

  type EffectChangeData = BaseActiveEffect.Properties["changes"][number];
}

export default BaseActiveEffect;
/**
 * The data schema for an ActiveEffect document.
 */
declare class BaseActiveEffect extends Document<
  BaseActiveEffect.Schema,
  BaseActiveEffect.Metadata,
  Actor.ConfiguredInstance | Item.ConfiguredInstance | null
> {
  /**
   * @param data    - Initial data from which to construct the ActiveEffect
   * @param context - Construction context options
   */
  constructor(data?: BaseActiveEffect.ConstructorData, context?: DocumentConstructionContext);

  override canUserModify(user: documents.BaseUser, action: "create" | "update" | "delete", data?: AnyObject): boolean;

  static override metadata: Readonly<BaseActiveEffect.Metadata>;

  static override defineSchema(): BaseActiveEffect.Schema;

  override testUserPermission(
    user: documents.BaseUser,
    permission: keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS,
    options?: InexactPartial<{
      /**
       * Require the exact permission level requested?
       * @defaultValue `false`
       */
      exact: boolean;
    }>,
  ): boolean;

  /**
   * @privateRemarks _preCreate overridden but with no signature changes.
   * For type simplicity it is left off. These methods historically have been the source of a large amount of computation from tsc.
   */

  protected override _initialize(options?: any): void;

  static override migrateData(source: AnyObject): AnyObject;

  /**
   * @deprecated since v11, will be removed in v13
   * @remarks Replaced by name
   */
  get label(): string;
}

declare namespace BaseActiveEffect {
  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "ActiveEffect";
      collection: "effects";
      label: string;
      labelPlural: string;
      schemaVersion: string;
    }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies the ActiveEffect within a parent Actor or Item
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The array of EffectChangeData objects which the ActiveEffect applies
     * @defaultValue `[]`
     */
    changes: fields.ArrayField<
      fields.SchemaField<{
        /**
         * The attribute path in the Actor or Item data which the change modifies
         * @defaultValue `""`
         */
        key: fields.StringField<{ required: true; label: "EFFECT.ChangeKey" }>;

        /**
         * The value of the change effect
         * @defaultValue `""`
         */
        value: fields.StringField<{ required: true; label: "EFFECT.ChangeValue" }>;

        /**
         * The modification mode with which the change is applied
         * @defaultValue `CONST.ACTIVE_EFFECT_MODES.ADD`
         */
        mode: fields.NumberField<{
          integer: true;
          initial: typeof CONST.ACTIVE_EFFECT_MODES.ADD;
          label: "EFFECT.ChangeMode";
        }>;

        /**
         * The priority level with which this change is applied
         * @defaultValue `null`
         */
        priority: fields.NumberField;
      }>
    >;

    /**
     * Is this ActiveEffect currently disabled?
     * @defaultValue `false`
     */
    disabled: fields.BooleanField;

    /**
     * An EffectDurationData object which describes the duration of the ActiveEffect
     * @defaultValue see properties
     */
    duration: fields.SchemaField<{
      /**
       * The world time when the active effect first started
       * @defaultValue `null`
       */
      startTime: fields.NumberField<{ initial: null; label: "EFFECT.StartTime" }>;

      /**
       * The maximum duration of the effect, in seconds
       * @defaultValue `null`
       */
      seconds: fields.NumberField<{ integer: true; min: 0; label: "EFFECT.DurationSecs" }>;

      /**
       * The _id of the CombatEncounter in which the effect first started
       * @defaultValue `null`
       */
      combat: fields.ForeignDocumentField<documents.BaseCombat, { label: "EFFECT.Combat" }>;

      /**
       * The maximum duration of the effect, in combat rounds
       * @defaultValue `null`
       */
      rounds: fields.NumberField<{ integer: true; min: 0 }>;

      /**
       * The maximum duration of the effect, in combat turns
       * @defaultValue `null`
       */
      turns: fields.NumberField<{ integer: true; min: 0; label: "EFFECT.DurationTurns" }>;

      /**
       * The round of the CombatEncounter in which the effect first started
       * @defaultValue `null`
       */
      startRound: fields.NumberField<{ integer: true; min: 0 }>;

      /**
       * The turn of the CombatEncounter in which the effect first started
       * @defaultValue `null`
       */
      startTurn: fields.NumberField<{ integer: true; min: 0; label: "EFFECT.StartTurns" }>;
    }>;

    /**
     * The HTML text description for this ActiveEffect document.
     * @defaultValue `""`
     */
    description: fields.HTMLField<{ label: "EFFECT.Description"; textSearch: true }>;

    /**
     * An icon image path used to depict the ActiveEffect
     * @defaultValue `null`
     */
    icon: fields.FilePathField<{ categories: "IMAGE"[]; label: "EFFECT.Icon" }>;

    /**
     * The name of the ActiveEffect
     * @defaultValue `""`
     */
    name: fields.StringField<{ required: true; label: "EFFECT.Label" }>;

    /**
     * A UUID reference to the document from which this ActiveEffect originated
     * @defaultValue `null`
     */
    origin: fields.StringField<{ nullable: true; blank: false; initial: null; label: "EFFECT.Origin" }>;

    /**
     * A color string which applies a tint to the ActiveEffect icon
     * @defaultValue `null`
     */
    tint: fields.ColorField<{ label: "EFFECT.IconTint" }>;

    /**
     * Does this ActiveEffect automatically transfer from an Item to an Actor?
     * @defaultValue `false`
     */
    transfer: fields.BooleanField<{ initial: true; label: "EFFECT.Transfer" }>;

    /**
     * Special status IDs that pertain to this effect
     * @defaultValue `[]`
     */
    statuses: fields.SetField<fields.StringField<{ required: true; blank: false }>>;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"ActiveEffect", InterfaceToObject<CoreFlags>>;
  }

  interface CoreFlags {
    core?: { statusId?: string; overlay?: boolean };
  }
}
