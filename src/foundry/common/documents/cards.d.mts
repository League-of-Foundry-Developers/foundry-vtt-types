import type { AnyObject, Merge } from "../../../types/utils.mts";
import type Document from "../abstract/document.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type * as fields from "../data/fields.d.mts";
import type * as documents from "./module.mts";

declare global {
  type CardsData = BaseCards.Properties;
}

/**
 * The Document definition for Cards.
 * Defines the DataSchema and common behaviors for Cards which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare class BaseCards extends Document<BaseCards.Schema, BaseCards.Metadata, any> {
  /**
   * @param data    - Initial data from which to construct the Cards
   * @param context - Construction context options
   */
  constructor(data: BaseCards.ConstructorData, context?: Document.ConstructionContext<BaseCards.Parent>);

  override parent: BaseCards.Parent;

  override _source: BaseCards.Source;

  static override metadata: Readonly<BaseCards.Metadata>;

  static override defineSchema(): BaseCards.Schema;

  /**
   * The default icon used for a cards stack that does not have a custom image set
   * @defaultValue `"icons/svg/card-hand.svg"`
   */
  static DEFAULT_ICON: string;

  /**
   * The allowed set of CardsData types which may exist
   */
  static get TYPES(): BaseCards.TypeNames[];

  static override migrateData(source: AnyObject): AnyObject;

  static override shimData(
    data: AnyObject,
    options?: {
      /**
       * Apply shims to embedded models?
       * @defaultValue `true`
       */
      embedded?: boolean;
    },
  ): AnyObject;
}

export default BaseCards;

declare namespace BaseCards {
  type Parent = null;

  type TypeNames = fields.TypeDataField.TypeNames<typeof BaseCards>;

  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "Cards";
      collection: "cards";
      indexed: true;
      compendiumIndexFields: ["_id", "name", "description", "img", "type", "sort", "folder"];
      embedded: { Card: "cards" };
      label: "DOCUMENT.Cards";
      labelPlural: "DOCUMENT.CardsPlural";
      coreTypes: ["deck", "hand", "pile"];
    }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema<TypeName extends TypeNames = TypeNames> extends DataSchema {
    /**
     * The _id which uniquely identifies this stack of Cards document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /** The text name of this stack */
    name: fields.StringField<{ required: true; blank: false; label: "CARDS.Name"; textSearch: true }>;

    /**
     * The type of this stack, in BaseCards.metadata.types
     * @defaultValue `BaseCards.TYPES[0]`
     */
    type: fields.StringField<
      {
        required: true;
        label: "CARDS.Type";
        choices: () => typeof BaseCards.TYPES;
        initial: () => (typeof BaseCards.TYPES)[0];
        validationError: "The Cards type must be in the array of types supported by the game system";
      },
      TypeName,
      TypeName,
      TypeName
    >;

    /**
     * A text description of this stack
     * @defaultValue `""`
     */
    description: fields.HTMLField<{ label: "CARDS.Description"; textSearch: true }>;

    /**
     * An image or video which is used to represent the stack of cards
     * @defaultValue `BaseCards.DEFAULT_ICON`
     */
    img: fields.FilePathField<{
      categories: ["IMAGE", "VIDEO"];
      initial: () => typeof BaseCards.DEFAULT_ICON;
      label: "CARDS.Image";
    }>;

    /**
     * Game system data which is defined by the system template.json model
     * @defaultValue `{}`
     */
    system: fields.TypeDataField<typeof BaseCards>;

    /**
     * A collection of Card documents which currently belong to this stack
     * @defaultValue `[]`
     */
    cards: fields.EmbeddedCollectionField<typeof documents.BaseCard, Cards.ConfiguredInstance>;

    /**
     * The visible width of this stack
     * @defaultValue `null`
     */
    width: fields.NumberField<{ integer: true; positive: true; label: "Width" }>;

    /**
     * The visible height of this stack
     * @defaultValue `null`
     */
    height: fields.NumberField<{ integer: true; positive: true; label: "Height" }>;

    /**
     * The angle of rotation of this stack
     * @defaultValue `0`
     */
    rotation: fields.AngleField<{ label: "Rotation" }>;

    /**
     * Whether or not to publicly display the number of cards in this stack
     * @defaultValue `false`
     */
    displayCount: fields.BooleanField;

    /**
     * The _id of a Folder which contains this document
     * @defaultValue `null`
     */
    folder: fields.ForeignDocumentField<documents.BaseFolder>;

    /**
     * The sort order of this stack relative to others in its parent collection
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object which configures ownership of this Cards
     * @defaultValue see {@link fields.DocumentOwnershipField}
     */
    ownership: fields.DocumentOwnershipField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"Cards">;

    /**
     * An object of creation and access information
     * @defaultValue see {@link fields.DocumentStatsField}
     */
    _stats: fields.DocumentStatsField;
  }
}
