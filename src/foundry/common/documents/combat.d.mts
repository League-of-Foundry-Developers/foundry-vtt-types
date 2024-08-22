import type { Merge } from "../../../types/utils.mts";
import type Document from "../abstract/document.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type * as fields from "../data/fields.d.mts";
import type * as documents from "./module.mts";

declare global {
  type CombatData = BaseCombat.Properties;
}

/**
 * The Document definition for a Combat.
 * Defines the DataSchema and common behaviors for a Combat which are shared between both client and server.
 */
declare class BaseCombat extends Document<BaseCombat.Schema, BaseCombat.Metadata> {
  /**
   * @param data    - Initial data from which to construct the Combat
   * @param context - Construction context options
   */
  constructor(data?: BaseCombat.ConstructorData, context?: DocumentConstructionContext);

  static override metadata: Readonly<BaseCombat.Metadata>;

  static override defineSchema(): BaseCombat.Schema;

  /**
   * Is a user able to update an existing Combat?
   * @internal
   */
  static #canUpdate(user: documents.BaseUser, doc: BaseCombat, data: BaseCombat.UpdateData): boolean;
}
export default BaseCombat;

declare namespace BaseCombat {
  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "Combat";
      collection: "combats";
      label: "DOCUMENT.Combat";
      labelPlural: "DOCUMENT.Combats";
      embedded: {
        Combatant: "combatants";
      };
      permissions: {
        update: (user: documents.BaseUser, doc: Document.Any, data: UpdateData) => boolean;
      };
    }
  >;

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

    /**
     * The _id of a Scene within which this Combat occurs
     * @defaultValue `null`
     */
    scene: fields.ForeignDocumentField<documents.BaseScene>;

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
