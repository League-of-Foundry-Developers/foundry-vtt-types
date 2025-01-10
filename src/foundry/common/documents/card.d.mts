import type { InexactPartial } from "../../../utils/index.d.mts";
import type Document from "../abstract/document.mts";
import type * as CONST from "../constants.mts";
import type * as fields from "../data/fields.d.mts";
import type * as documents from "./_module.mts";

type DataSchema = foundry.data.fields.DataSchema;

/**
 * The Card Document.
 * Defines the DataSchema and common behaviors for a Card which are shared between both client and server.
 */
// Note(LukeAbby): You may wonder why documents don't simply pass the `Parent` generic parameter.
// This pattern evolved from trying to avoid circular loops and even internal tsc errors.
// See: https://gist.github.com/LukeAbby/0d01b6e20ef19ebc304d7d18cef9cc21
declare class BaseCard extends Document<"Card", BaseCard.Schema, any> {
  /**
   * @privateRemarks Manual override of the return due to TS limitations with static `this`
   */
  static get TYPES(): BaseCard.TypeNames[];

  /**
   * @param data    - Initial data from which to construct the Card
   * @param context - Construction context options
   */
  // TODO(LukeAbby): This constructor is a symptom of a circular error.
  // constructor(data: BaseCard.ConstructorData, context?: Document.ConstructionContext<BaseCard.Parent>);

  override parent: BaseCard.Parent;

  override _source: BaseCard.Source;

  static override metadata: BaseCard.Metadata;

  static override defineSchema(): BaseCard.Schema;

  /**
   * The default icon used for a Card face that does not have a custom image set
   * @defaultValue `"icons/svg/card-joker.svg"`
   */
  static DEFAULT_ICON: string;

  /**
   * Is a User able to create a new Card within this parent?
   */
  static #canCreate(user: User, doc: BaseCard, data: BaseCard.ConstructorData): boolean;

  /**
   * Is a user able to update an existing Card?
   */
  static #canUpdate(user: User, doc: BaseCard, data: BaseCard.UpdateData): boolean;

  override testUserPermission(
    user: User,
    permission: keyof typeof CONST.DOCUMENT_OWNERSHIP_LEVELS | CONST.DOCUMENT_OWNERSHIP_LEVELS,
    options?: InexactPartial<{
      /**
       * Require the exact permission level requested?
       * @defaultValue `false`
       */
      exact: boolean;
    }>,
  ): boolean;
}

export default BaseCard;

declare namespace BaseCard {
  type Parent = Cards.ConfiguredInstance | null;

  type TypeNames = Game.Model.TypeNames<"Card">;

  type Metadata = Document.MetadataFor<BaseCard>;

  type SchemaField = fields.SchemaField<Schema>;
  type ConstructorData = fields.SchemaField.InnerConstructorType<Schema>;
  type UpdateData = fields.SchemaField.InnerAssignmentType<Schema>;
  type Properties = fields.SchemaField.InnerInitializedType<Schema>;
  type Source = fields.SchemaField.InnerPersistedType<Schema>;

  interface Schema extends DataSchema {
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
    type: fields.DocumentTypeField<
      typeof BaseCard,
      {
        initial: typeof foundry.CONST.BASE_DOCUMENT_TYPE;
      }
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
    origin: fields.ForeignDocumentField<typeof documents.BaseCards>;

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

    _stats: fields.DocumentStatsField;
  }
}
