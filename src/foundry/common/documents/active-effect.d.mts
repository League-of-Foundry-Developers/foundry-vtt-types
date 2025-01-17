import type { InterfaceToObject, AnyObject, InexactPartial } from "../../../utils/index.d.mts";
import type Document from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type * as fields from "../data/fields.d.mts";
import type * as documents from "./_module.mts";

type DataSchema = foundry.data.fields.DataSchema;

/**
 * The ActiveEffect Document.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare abstract class BaseActiveEffect<
  out SubType extends BaseActiveEffect.SubType = BaseActiveEffect.SubType,
> extends Document<"ActiveEffect", BaseActiveEffect._Schema, any> {
  /**
   * @param data    - Initial data from which to construct the ActiveEffect
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is causing a circular error.
  // constructor(data?: BaseActiveEffect.ConstructorData, context?: Document.ConstructionContext<BaseActiveEffect.Parent>);

  override system: Document.SystemFor<"ActiveEffect", SubType>;

  override parent: BaseActiveEffect.Parent;

  override canUserModify(
    user: User.ConfiguredInstance,
    action: "create" | "update" | "delete",
    data?: AnyObject,
  ): boolean;

  static override metadata: BaseActiveEffect.Metadata;

  static override defineSchema(): BaseActiveEffect.Schema;

  override testUserPermission(
    user: User.ConfiguredInstance,
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

  static override migrateData(source: AnyObject): AnyObject;

  /**
   * @deprecated since v11, will be removed in v13
   * @remarks Replaced by `name`
   */
  get label(): this["name"];

  set label(value);

  /**
   * @deprecated since v12, will be removed in v14
   * @remarks Replaced by `img`
   */
  get icon(): this["img"];

  set icon(value);

  static " __fvtt_types_internal_document_name_static": "ActiveEffect";
}

export default BaseActiveEffect;

declare namespace BaseActiveEffect {
  /**
   * A document's metadata is special information about the document ranging anywhere from its name,
   * whether it's indexed, or to the permissions a user has over it.
   */
  type Metadata = Document.MetadataFor<"ActiveEffect">;

  type SubType = Game.Model.TypeNames<"ActiveEffect">;
  type OfType<Type extends SubType> = Document.OfType<"ActiveEffect", Type>;

  /**
   * A document's parent is something that can contain it.
   * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
   */
  type Parent = Actor.ConfiguredInstance | Item.ConfiguredInstance | null;

  type Source = fields.SchemaField.PersistedData<Schema>;
  type PersistedData = fields.SchemaField.PersistedData<Schema>;
  type CreateData = fields.SchemaField.CreateData<Schema>;
  type InitializedData = fields.SchemaField.InitializedData<Schema>;
  type UpdateData = fields.SchemaField.UpdateData<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies the ActiveEffect within a parent Actor or Item
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The name of the ActiveEffect
     * @defaultValue `""`
     */
    name: fields.StringField<{ required: true; label: "EFFECT.Label" }>;

    /**
     * An image path used to depict the ActiveEffect as an icon
     * @defaultValue `null`
     */
    img: fields.FilePathField<{ categories: "IMAGE"[]; label: "EFFECT.Image" }>;

    type: fields.DocumentTypeField<typeof BaseActiveEffect, { initial: typeof foundry.CONST.BASE_DOCUMENT_TYPE }>;

    system: fields.TypeDataField<typeof BaseActiveEffect>;

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
     * The HTML text description for this ActiveEffect document.
     * @defaultValue `""`
     */
    description: fields.HTMLField<{ label: "EFFECT.Description"; textSearch: true }>;

    /**
     * A UUID reference to the document from which this ActiveEffect originated
     * @defaultValue `null`
     */
    origin: fields.StringField<{ nullable: true; blank: false; initial: null; label: "EFFECT.Origin" }>;

    /**
     * A color string which applies a tint to the ActiveEffect icon
     * @defaultValue `"#ffffff"`
     */
    tint: fields.ColorField<{ nullable: false; initial: "#ffffff"; label: "EFFECT.IconTint" }>;

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

    sort: fields.IntegerSortField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"ActiveEffect", InterfaceToObject<CoreFlags>>;

    _stats: fields.DocumentStatsField;
  }

  // The document subclasses override `system` anyways.
  // There's no point in doing expensive computation work comparing the base class system.
  /** @internal */
  interface _Schema extends Schema {
    system: any;
  }

  interface CoreFlags {
    core?: { statusId?: string; overlay?: boolean };
  }

  /**
   * @deprecated This type is used by Foundry too vaguely.
   * In one context the most correct type is after initialization whereas in another one it should be
   * before but Foundry uses it interchangeably.
   */
  type Properties = fields.SchemaField.InitializedData<Schema>;

  /** @deprecated {@link BaseActiveEffect.SubType | `BaseActiveEffect.SubType`} */
  type TypeNames = SubType;

  /**
   * @deprecated {@link fields.SchemaField | `SchemaField<BaseActiveEffect.Schema>`}
   */
  type SchemaField = fields.SchemaField<Schema>;

  /**
   * @deprecated {@link BaseActiveEffect.CreateData | `BaseActiveEffect.CreateData`}
   */
  type ConstructorData = BaseActiveEffect.CreateData;
}
