import type { ConfiguredCard } from "../../../../configuration/index.d.mts";
import type { DeepPartial, InexactPartial } from "fvtt-types/utils";
import type { documents } from "../../../client-esm/client.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields } from "../../../common/data/module.d.mts";
import type { CardFaceData } from "../../../common/documents/_types.d.mts";
import type BaseCard from "../../../common/documents/card.d.mts";

declare global {
  namespace Card {
    /**
     * The implementation of the Card document instance configured through `CONFIG.Card.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredCard | `configuration/ConfiguredCard`} in fvtt-types.
     */
    type Implementation = Document.ConfiguredInstanceForName<"Card">;

    /**
     * The implementation of the Card document configured through `CONFIG.Card.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ConfiguredClassForName<"Card">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"Card"> {}

    type SubType = Game.Model.TypeNames<"Card">;
    type ConfiguredSubTypes = Document.ConfiguredSubTypesOf<"Card">;
    type Known = Card.OfType<Card.ConfiguredSubTypes>;
    type OfType<Type extends SubType> = Document.Internal.OfType<ConfiguredCard<Type>, Card<Type>>;

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = Cards.Implementation | null;

    /**
     * An instance of `Card` that comes from the database.
     */
    interface Stored<out Subtype extends SubType = SubType> extends Document.Stored<OfType<Subtype>> {}

    /**
     * The data put in {@link Document._source | `Document._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
     * but initialized as a {@link Set | `Set`}.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface Source extends PersistedData {}

    /**
     * The data put in {@link Card._source | `Card._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link Card.create | `Card.create`}
     * and {@link Card | `new Card(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link Document | `Document`} has been initialized, for example
     * {@link Card.name | `Card#name`}.
     *
     * This is data transformed from {@link Card.Source | `Card.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link Card.update | `Card#update`}.
     * It is a distinct type from {@link Card.CreateData | `DeepPartial<Card.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link Card | `Card`}. This is the source of truth for how an Card document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link Card | `Card`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
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

    namespace DatabaseOperation {
      /** Options passed along in Get operations for Card Documents */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<Card.Parent> {}
      /** Options passed along in Create operations for Card Documents */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<Card.CreateData, Card.Parent, Temporary> {}
      /** Options passed along in Delete operations for Card Documents */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Card.Parent> {}
      /** Options passed along in Update operations for Card Documents */
      interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Card.UpdateData, Card.Parent> {}

      /** Options for {@link Card.createDocuments | `Card.createDocuments`} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link Card._preCreateOperation | `Card._preCreateOperation`} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link Card#_preCreate | `Card#_preCreate`} */
      type PreCreateOperationInstance = Document.Database.PreCreateOperationInstance<Create>;
      /** Options for {@link Card#_onCreate | `Card#_onCreate`} */
      type OnCreateOperation = Document.Database.OnCreateOperation<Create>;

      /** Options for {@link Card.updateDocuments | `Card.updateDocuments`} */
      type UpdateOperation = Document.Database.UpdateOperation<Update>;
      /** Options for {@link Card._preUpdateOperation | `Card._preUpdateOperation`} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link Card#_preUpdate | `Card#_preUpdate`} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOperationInstance<Update>;
      /** Options for {@link Card#_onUpdate | `Card#_onUpdate`} */
      type OnUpdateOperation = Document.Database.OnUpdateOperation<Update>;

      /** Options for {@link Card.deleteDocuments | `Card.deleteDocuments`} */
      type DeleteOperation = Document.Database.DeleteOperation<Delete>;
      /** Options for {@link Card._preDeleteOperation | `Card._preDeleteOperation`} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link Card#_preDelete | `Card#_preDelete`} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link Card#_onDelete | `Card#_onDelete`} */
      type OnDeleteOperation = Document.Database.OnDeleteOperation<Delete>;
    }

    /**
     * @deprecated - {@link Card.DatabaseOperation}
     */
    interface DatabaseOperations extends Document.Database.Operations<Card> {}

    /**
     * @deprecated {@link Card.Types | `Card.SubType`}
     */
    type TypeNames = Card.SubType;

    /**
     * @deprecated {@link Card.CreateData | `Card.CreateData`}
     */
    interface ConstructorData extends Card.CreateData {}

    /**
     * @deprecated {@link Card.implementation | `Card.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link Card.Implementation | `Card.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side Card document which extends the common BaseCard document model.
   *
   * @see {@link Cards}                    The Cards document type which contains Card embedded documents
   */
  abstract class Card<out SubType extends Card.SubType = Card.SubType> extends ClientDocumentMixin(
    foundry.documents.BaseCard,
  )<SubType> {
    static override metadata: Card.Metadata;

    static get implementation(): Card.ImplementationClass;

    /**
     * The current card face
     */
    get currentFace(): CardFaceData | null;

    /**
     * The image of the currently displayed card face or back
     */
    get img(): string;

    /**
     * The name of the current card face, or the name of the card itself
     */
    get name(): string;

    /**
     * A reference to the source Cards document which defines this Card.
     */
    get source(): Cards.Implementation | undefined | null;

    /**
     * A convenience property for whether or not the Card is within its source Cards stack. Cards in decks are always
     * considered home.
     */
    get isHome(): boolean;

    /**
     * Whether or not to display the face of this card?
     */
    get showFace(): boolean;

    /**
     * Does this Card have a next face available to flip to?
     */
    get hasNextFace(): boolean;

    /**
     * Does this Card have a previous face available to flip to?
     */
    get hasPreviousFace(): boolean;

    override prepareDerivedData(): void;

    /**
     * Flip this card to some other face. A specific face may be requested, otherwise:
     * If the card currently displays a face the card is flipped to the back.
     * If the card currently displays the back it is flipped to the first face.
     * @param face - A specific face to flip the card to
     * @returns A reference to this card after the flip operation is complete
     */
    flip(face?: number | null): Promise<Card.Implementation | undefined>;

    /**
     * Pass this Card to some other Cards document.
     * @param to      - A new Cards document this card should be passed to
     * @param options - (default: `{}`)
     * @returns A reference to this card after the it has been passed to another parent document
     */
    pass(to: Cards.Implementation, options?: Cards.PassOptions): Promise<Card.Implementation | undefined>;

    /**
     * Play a specific card to some other Cards document.
     * This method is currently a more semantic alias for Card#pass.
     * @see Card#pass
     */
    play(to: Cards.Implementation, options?: Cards.PassOptions): Promise<Card.Implementation | undefined>;

    /**
     * Discard a specific card to some other Cards document.
     * This method is currently a more semantic alias for Card#pass.
     * @see Card#pass
     */
    discard(to: Cards.Implementation, options?: Cards.PassOptions): Promise<Card.Implementation | undefined>;

    /**
     * Recall this Card to its original Cards parent.
     * @param options - Options which modify the recall operation
     *                  (default: `{}`)
     * @returns A reference to the recallled card belonging to its original parent
     */
    recall(options?: Cards.ResetOptions): Promise<Card.Implementation>;

    /**
     * Create a chat message which displays this Card.
     * @param messageData - Additional data which becomes part of the created ChatMessageData
     *                      (default: `{}`)
     * @param options     - Options which modify the message creation operation
     *                      (default: `{}`)
     * @returns The created chat message
     */
    toMessage(
      messageData?: DeepPartial<foundry.documents.BaseChatMessage.CreateData>,
      options?: InexactPartial<Document.OnCreateOptions<"ChatMessage">>,
    ): Promise<ChatMessage.Implementation | undefined>;
  }
}
