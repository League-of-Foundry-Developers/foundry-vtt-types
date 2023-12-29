// FOUNDRY_VERSION: 10.291

import type { Merge } from "../../../types/utils.mts";
import type Document from "../abstract/document.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type * as fields from "../data/fields.mts";
import type * as documents from "./module.mts";

declare global {
  type CardsData<TypeName extends BaseCards.TypeNames = BaseCards.TypeNames> = BaseCards.Properties<TypeName>;
}

/**
 * The Document definition for Cards.
 * Defines the DataSchema and common behaviors for Cards which are shared between both client and server.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface BaseCards<TypeName extends BaseCards.TypeNames = BaseCards.TypeNames>
  extends BaseCards.Properties<TypeName> {}
declare class BaseCards<TypeName extends BaseCards.TypeNames = BaseCards.TypeNames> extends Document<
  BaseCards.SchemaField<TypeName>,
  BaseCards.Metadata
> {
  /**
   * @param data    - Initial data from which to construct the Cards
   * @param context - Construction context options
   */
  constructor(data: BaseCards.ConstructorData<TypeName>, context?: DocumentConstructionContext);

  override _source: BaseCards.Source<TypeName>;

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

  static override migrateData(source: object): object;

  static override shimData(
    data: object,
    {
      embedded,
    }?: {
      /**
       * Apply shims to embedded models?
       * @defaultValue `true`
       */
      embedded?: boolean;
    },
  ): object;
}
export default BaseCards;

declare namespace BaseCards {
  type TypeNames = fields.SystemDataField.TypeNames<typeof BaseCards>;

  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "Cards";
      collection: "cards";
      indexed: true;
      compendiumIndexFields: ["_id", "name", "img", "type", "sort"];
      embedded: { Card: "cards" };
      label: "DOCUMENT.Cards";
      labelPlural: "DOCUMENT.CardsPlural";
      coreTypes: ["deck", "hand", "pile"];
    }
  >;

  type SchemaField<TypeName extends TypeNames> = fields.SchemaField<Schema<TypeName>>;
  type ConstructorData<TypeName extends TypeNames> = UpdateData<TypeName> &
    Required<Pick<UpdateData<TypeName>, "name">>;
  type UpdateData<TypeName extends TypeNames> = fields.SchemaField.InnerAssignmentType<Schema<TypeName>>;
  type Properties<TypeName extends TypeNames> = fields.SchemaField.InnerInitializedType<Schema<TypeName>>;
  type Source<TypeName extends TypeNames> = fields.SchemaField.InnerPersistedType<Schema<TypeName>>;

  interface Schema<TypeName extends TypeNames = TypeNames> extends DataSchema {
    /**
     * The _id which uniquely identifies this stack of Cards document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /** The text name of this stack */
    name: fields.StringField<{ required: true; blank: false; label: "CARDS.Name" }>;

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
    description: fields.HTMLField<{ label: "CARDS.Description" }>;

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
    system: fields.SystemDataField<typeof BaseCards, TypeName>;

    /**
     * A collection of Card documents which currently belong to this stack
     * @defaultValue `[]`
     */
    cards: fields.EmbeddedCollectionField<typeof documents.BaseCard>;

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
    folder: fields.ForeignDocumentField<typeof documents.BaseFolder>;

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
