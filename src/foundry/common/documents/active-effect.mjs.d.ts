import type Document from "../abstract/document.mjs";
import type { DocumentMetadata, DocumentModificationOptions } from "../abstract/document.mjs";
import type * as CONST from "../constants.mjs";
import type * as fields from "../data/fields.mjs";
import type * as documents from "./module.mjs";

declare global {
  type ActiveEffectData = BaseActiveEffect.Properties;

  type EffectDurationData = BaseActiveEffect.Properties["duration"];

  type EffectChangeData = BaseActiveEffect.Properties["changes"][number];
}

export default BaseActiveEffect;
/**
 * The data schema for an ActiveEffect document.
 */
declare class BaseActiveEffect<Parent extends Document.Any | null = null> extends Document<
  BaseActiveEffect.SchemaField,
  BaseActiveEffect.Metadata,
  Parent
> {
  /**
   * @param data    - Initial data from which to construct the ActiveEffect
   * @param context - Construction context options
   */
  constructor(data?: BaseActiveEffect.ConstructorData, context?: DocumentConstructionContext);

  static override metadata: Readonly<BaseActiveEffect.Metadata>;

  static override defineSchema(): BaseActiveEffect.Schema;

  override testUserPermission(
    user: documents.BaseUser,
    permission: keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS,
    {
      exact
    }?: {
      /**
       * Require the exact permission level requested?
       * @defaultValue `false`
       */
      exact?: boolean;
    }
  ): boolean;

  protected override _preCreate(
    data: fields.SchemaField.AssignmentType<BaseActiveEffect.Schema, {}>,
    options: DocumentModificationOptions,
    user: documents.BaseUser
  ): Promise<void>;

  static override migrateData(source: object): object;
}

declare namespace BaseActiveEffect {
  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "ActiveEffect";
      collection: "effects";
      label: "DOCUMENT.ActiveEffect";
      labelPlural: "DOCUMENT.ActiveEffects";
    }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = UpdateData;
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
     * @defaultValue
     * ```typescript
     * {
     *   startTime: null,
     *   seconds: null,
     *   combat: null,
     *   rounds: null,
     *   turns: null,
     *   startRound: null,
     *   startTurn: null
     * }
     * ```
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
      combat: fields.ForeignDocumentField<typeof documents.BaseCombat, { label: "EFFECT.Combat" }>;

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
     * An icon image path used to depict the ActiveEffect
     * @defaultValue `null`
     */
    icon: fields.FilePathField<{ categories: "IMAGE"[]; label: "EFFECT.Icon" }>;

    /**
     * A text label which describes the name of the ActiveEffect
     * @defaultValue `""`
     */
    label: fields.StringField<{ required: true; label: "EFFECT.Label" }>;

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
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"ActiveEffect", CoreFlags>;
  }

  interface CoreFlags {
    core?: { statusId?: string; overlay?: boolean };
  }
}
