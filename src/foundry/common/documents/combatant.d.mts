import type { Merge } from "../../../types/utils.mts";
import type Document from "../abstract/document.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type * as fields from "../data/fields.d.mts";
import type * as documents from "./module.mts";

declare global {
  type CombatantData = BaseCombatant.Properties;
}

/**
 * The Document definition for a Combatant.
 * Defines the DataSchema and common behaviors for a Combatant which are shared between both client and server.
 */
declare class BaseCombatant extends Document<
  BaseCombatant.Schema,
  BaseCombatant.Metadata,
  Combat.ConfiguredInstance | null
> {
  /**
   * @param data    - Initial data from which to construct the Combatant
   * @param context - Construction context options
   */
  constructor(data?: BaseCombatant.ConstructorData, context?: DocumentConstructionContext);

  static override metadata: Readonly<BaseCombatant.Metadata>;

  static override defineSchema(): BaseCombatant.Schema;

  /**
   * Is a user able to update an existing Combatant?
   * @internal
   */
  static #canUpdate(user: documents.BaseUser, doc: BaseCombatant, data: BaseCombatant.UpdateData): boolean;

  /**
   * Is a user able to create this Combatant?
   * @internal
   */
  static #canCreate(user: documents.BaseUser, doc: BaseCombatant, data: BaseCombatant.ConstructorData): boolean;
}
export default BaseCombatant;

declare namespace BaseCombatant {
  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "Combatant";
      collection: "combatants";
      label: "DOCUMENT.Combatant";
      labelPlural: "DOCUMENT.Combatants";
      isEmbedded: true;
      permissions: {
        create: (user: documents.BaseUser, doc: Document.Any) => boolean;
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
     * The _id which uniquely identifies this Combatant embedded document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /**
     * The _id of an Actor associated with this Combatant
     * @defaultValue `null`
     */
    actorId: fields.ForeignDocumentField<documents.BaseActor, { label: "COMBAT.CombatantActor"; idOnly: true }>;

    /**
     * The _id of a Token associated with this Combatant
     * @defaultValue `null`
     */
    tokenId: fields.ForeignDocumentField<documents.BaseToken, { label: "COMBAT.CombatantToken"; idOnly: true }>;

    /**
     * @defaultValue `null`
     */
    sceneId: fields.ForeignDocumentField<documents.BaseScene, { label: "COMBAT.CombatantScene"; idOnly: true }>;

    /**
     * A customized name which replaces the name of the Token in the tracker
     * @defaultValue `""`
     */
    name: fields.StringField<{ label: "COMBAT.CombatantName" }>;

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
  }
}
