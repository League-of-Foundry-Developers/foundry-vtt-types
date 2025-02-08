import type Document from "../abstract/document.mts";
import type { DOCUMENT_OWNERSHIP_LEVELS } from "../constants.d.mts";
import type * as fields from "../data/fields.d.mts";
import type * as documents from "./_module.mts";

type DataSchema = foundry.data.fields.DataSchema;

/**
 * The Combatant Document.
 * Defines the DataSchema and common behaviors for a Combatant which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare class BaseCombatant extends Document<"Combatant", BaseCombatant.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the Combatant
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data?: BaseCombatant.ConstructorData, context?: Document.ConstructionContext<BaseCombatant.Parent>);

  override parent: BaseCombatant.Parent;

  static override metadata: BaseCombatant.Metadata;

  static override defineSchema(): BaseCombatant.Schema;

  override getUserLevel(user?: User): DOCUMENT_OWNERSHIP_LEVELS | null;

  #baseCombatant: true;
}

export default BaseCombatant;

declare namespace BaseCombatant {
  type Parent = Combat.ConfiguredInstance | null;

  type TypeNames = Game.Model.TypeNames<"Combatant">;

  type Metadata = Document.MetadataFor<BaseCombatant>;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Combatant embedded document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    type: fields.DocumentTypeField<typeof BaseCombatant, { initial: typeof foundry.CONST.BASE_DOCUMENT_TYPE }>;

    system: fields.TypeDataField<typeof BaseCombatant>;

    /**
     * The _id of an Actor associated with this Combatant
     * @defaultValue `null`
     */
    actorId: fields.ForeignDocumentField<typeof documents.BaseActor, { label: "COMBAT.CombatantActor"; idOnly: true }>;

    /**
     * The _id of a Token associated with this Combatant
     * @defaultValue `null`
     */
    tokenId: fields.ForeignDocumentField<typeof documents.BaseToken, { label: "COMBAT.CombatantToken"; idOnly: true }>;

    /**
     * @defaultValue `null`
     */
    sceneId: fields.ForeignDocumentField<typeof documents.BaseScene, { label: "COMBAT.CombatantScene"; idOnly: true }>;

    /**
     * A customized name which replaces the name of the Token in the tracker
     * @defaultValue `""`
     */
    name: fields.StringField<{ label: "COMBAT.CombatantName"; textSearch: true }>;

    /**
     * A customized image which replaces the Token image in the tracker
     * @defaultValue `null`
     */
    img: fields.FilePathField<{ categories: "IMAGE"[]; label: "COMBAT.CombatantImage" }>;

    /**
     * The initiative score for the Combatant which determines its turn order
     * @defaultValue `null`
     */
    initiative: fields.NumberField<{ label: "COMBAT.CombatantInitiative" }>;

    /**
     * Is this Combatant currently hidden?
     * @defaultValue `false`
     */
    hidden: fields.BooleanField<{ label: "COMBAT.CombatantHidden" }>;

    /**
     * Has this Combatant been defeated?
     * @defaultValue `false`
     */
    defeated: fields.BooleanField<{ label: "COMBAT.CombatantDefeated" }>;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"Combatant">;

    _stats: fields.DocumentStatsField;
  }
}
