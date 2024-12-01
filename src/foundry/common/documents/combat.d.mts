import type Document from "../abstract/document.mts";
import type * as fields from "../data/fields.d.mts";
import type * as documents from "./_module.mts";

/**
 * The Combat Document.
 * Defines the DataSchema and common behaviors for a Combat which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare class BaseCombat extends Document<"Combat", BaseCombat.Schema, any> {
  /**
   * @param data    - Initial data from which to construct the Combat
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data?: BaseCombat.ConstructorData, context?: Document.ConstructionContext<BaseCombat.Parent>);

  override parent: BaseCombat.Parent;

  static override metadata: BaseCombat.Metadata;

  static override defineSchema(): BaseCombat.Schema;

  /**
   * Is a user able to update an existing Combat?
   * @internal
   */
  static #canUpdate(user: documents.BaseUser, doc: BaseCombat, data: BaseCombat.UpdateData): boolean;

  /**
   * Can a certain User change the Combat round?
   * @param user - The user attempting to change the round
   * @returns Is the user allowed to change the round?
   */
  protected _canChangeRound(user: User.ConfiguredInstance): boolean;

  /**
   * Can a certain User change the Combat turn?
   * @param user - The user attempting to change the turn
   * @returns Is the user allowed to change the turn?
   */
  protected _canChangeTurn(user: User.ConfiguredInstance): boolean;

  // BaseCombat implements _preUpdate but leaving out here for type computation reasons
}

export default BaseCombat;

declare namespace BaseCombat {
  type Parent = null;

  type TypeNames = Game.Model.TypeNames<"Combat">;

  type Metadata = Document.MetadataFor<BaseCombat>;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
    /**
     * The _id which uniquely identifies this Combat document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    type: fields.DocumentTypeField<typeof BaseCombat, { initial: typeof foundry.CONST.BASE_DOCUMENT_TYPE }>;

    system: fields.TypeDataField<typeof BaseCombat>;

    /**
     * The _id of a Scene within which this Combat occurs
     * @defaultValue `null`
     */
    scene: fields.ForeignDocumentField<typeof documents.BaseScene>;

    /**
     * A Collection of Combatant embedded Documents
     * @defaultValue `[]`
     */
    combatants: fields.EmbeddedCollectionField<typeof documents.BaseCombatant, Combat.ConfiguredInstance>;

    /**
     * Is the Combat encounter currently active?
     * @defaultValue `false`
     */
    active: fields.BooleanField;

    /**
     * The current round of the Combat encounter
     * @defaultValue `0`
     */
    round: fields.NumberField<{
      required: true;
      nullable: false;
      integer: true;
      min: 0;
      initial: 0;
      label: "COMBAT.Round";
    }>;

    /**
     * The current turn in the Combat round
     * @defaultValue `null`
     */
    turn: fields.NumberField<{ required: true; integer: true; min: 0; initial: null; label: "COMBAT.Turn" }>;

    /**
     * The current sort order of this Combat relative to others in the same Scene
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"Combat">;

    /**
     * An object of creation and access information
     * @defaultValue see {@link fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }
}
