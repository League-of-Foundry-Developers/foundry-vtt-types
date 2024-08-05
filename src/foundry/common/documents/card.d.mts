import type { AnyObject, InexactPartial, Merge } from "../../../types/utils.mts";
import type Document from "../abstract/document.mts";
import type { DocumentMetadata } from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type * as fields from "../data/fields.d.mts";
import type * as documents from "./_module.mts";

declare global {
  type CardData = BaseCard.Properties;

  type CardFaceData = BaseCard.Properties["faces"][number];
}

/**
 * The Document definition for a Card.
 * Defines the DataSchema and common behaviors for a Card which are shared between both client and server.
 */
declare class BaseCard extends Document<BaseCard.Schema, BaseCard.Metadata, Cards.ConfiguredInstance | null> {
  /**
   * @param data    - Initial data from which to construct the Card
   * @param context - Construction context options
   */
  constructor(data: BaseCard.ConstructorData, context?: DocumentConstructionContext);

  override _source: BaseCard.Source;

  static override metadata: Readonly<BaseCard.Metadata>;

  static override defineSchema(): BaseCard.Schema;

  /**
   * The default icon used for a Card face that does not have a custom image set
   * @defaultValue `"icons/svg/card-joker.svg"`
   */
  static DEFAULT_ICON: string;

  /**
   * The allowed set of Card types which may exist
   */
  static get TYPES(): BaseCard.TypeNames[];

  /**
   * Is a User able to create a new Card within this parent?
   */
  static #canCreate(user: documents.BaseUser, doc: BaseCard, data: BaseCard.ConstructorData): boolean;

  /**
   * Is a user able to update an existing Card?
   */
  static #canUpdate(user: documents.BaseUser, doc: BaseCard, data: BaseCard.UpdateData): boolean;

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
export default BaseCard;

declare namespace BaseCard {
  type TypeNames = fields.TypeDataField.TypeNames<typeof BaseCard>;

  type Metadata = Merge<
    DocumentMetadata,
    {
      name: "Card";
      collection: "cards";
      indexed: true;
      label: string;
      labelPlural: string;
      permissions: {
        create: () => boolean;
        update: () => boolean;
      };
      schemaVersion: string;
    }
  >;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema<TypeName extends TypeNames = TypeNames> extends DataSchema {
    /**
     * The _id which uniquely identifies this Card document
     * @defaultValue `null`
     */
    _id: fields.DocumentIdField;

    /** The text name of this card */
    name: fields.StringField<{ required: true; blank: false; label: "CARD.Name" }>;

    /**
     * A text description of this card which applies to all faces
     * @defaultValue `""`
     */
    description: fields.HTMLField<{ label: "CARD.Description" }>;

    /**
     * A category of card (for example, a suit) to which this card belongs
     * @defaultValue `BaseCard.TYPES[0]`
     */
    type: fields.StringField<
      {
        required: true;
        label: "CARD.Type";
        choices: () => typeof BaseCard.TYPES;
        initial: () => (typeof BaseCard.TYPES)[0];
      },
      TypeName,
      TypeName,
      TypeName
    >;

    /**
     * Game system data which is defined by the system template.json model
     * @defaultValue `{}`
     */
    system: fields.TypeDataField<typeof BaseCard>;

    /**
     * An optional suit designation which is used by default sorting
     * @defaultValue `""`
     */
    suit: fields.StringField<{ label: "CARD.Suit" }>;

    /**
     * An optional numeric value of the card which is used by default sorting
     * @defaultValue `null`
     */
    value: fields.NumberField<{ label: "CARD.Value" }>;

    /**
     * An object of face data which describes the back of this card
     * @defaultValue see properties
     */
    back: fields.SchemaField<{
      /**
       * A name for this card face
       * @defaultValue `""`
       */
      name: fields.StringField<{ label: "CARD.BackName" }>;

      /**
       * Displayed text that belongs to this face
       * @defaultValue `""`
       */
      text: fields.HTMLField<{ label: "CARD.BackText" }>;

      /**
       * A displayed image or video file which depicts the face
       * @defaultValue `null`
       */
      img: fields.FilePathField<{ categories: ["IMAGE", "VIDEO"]; label: "CARD.BackImage" }>;
    }>;

    faces: fields.ArrayField<
      fields.SchemaField<{
        /**
         * A name for this card face
         * @defaultValue `""`
         */
        name: fields.StringField<{ label: "CARD.FaceName" }>;

        /**
         * Displayed text that belongs to this face
         * @defaultValue `""`
         */
        text: fields.HTMLField<{ label: "CARD.FaceText" }>;

        /**
         * A displayed image or video file which depicts the face
         * @defaultValue `BaseCard.DEFAULT_ICON`
         */
        img: fields.FilePathField<{
          categories: ["IMAGE", "VIDEO"];
          initial: () => typeof BaseCard.DEFAULT_ICON;
          label: "CARD.FaceImage";
        }>;
      }>
    >;

    /**
     * The index of the currently displayed face, or null if the card is face-down
     * @defaultValue `null`
     */
    face: fields.NumberField<{ required: true; initial: null; integer: true; min: 0; label: "CARD.Face" }>;

    /**
     * Whether this card is currently drawn from its source deck
     * @defaultValue `false`
     */
    drawn: fields.BooleanField<{ label: "CARD.Drawn" }>;

    /**
     * The document ID of the origin deck to which this card belongs
     * @defaultValue `null`
     */
    origin: fields.ForeignDocumentField<documents.BaseCards>;

    /**
     * The visible width of this card
     * @defaultValue `null`
     */
    width: fields.NumberField<{ integer: true; positive: true; label: "Width" }>;

    /**
     * The visible height of this card
     * @defaultValue `null`
     */
    height: fields.NumberField<{ integer: true; positive: true; label: "Height" }>;

    /**
     * The angle of rotation of this card
     * @defaultValue `0`
     */
    rotation: fields.AngleField<{ label: "Rotation" }>;

    /**
     * The sort order of this card relative to others in the same stack
     * @defaultValue `0`
     */
    sort: fields.IntegerSortField;

    /**
     * An object of optional key/value flags
     * @defaultValue `{}`
     */
    flags: fields.ObjectField.FlagsField<"Card">;
  }
}
