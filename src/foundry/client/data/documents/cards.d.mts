import type { ConfiguredCards } from "../../../../configuration/index.d.mts";
import type { DeepPartial, HandleEmptyObject, InexactPartial } from "../../../../utils/index.d.mts";
import type { documents } from "../../../client-esm/client.d.mts";
import type Document from "../../../common/abstract/document.d.mts";
import type { DataSchema } from "../../../common/data/fields.d.mts";
import type { fields } from "../../../common/data/module.d.mts";
import type BaseCards from "../../../common/documents/cards.d.mts";

declare global {
  namespace Cards {
    /**
     * The implementation of the Cards document instance configured through `CONFIG.Cards.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} or {@link ConfiguredCards | `configuration/ConfiguredCards`} in fvtt-types.
     */
    type Implementation = Document.ConfiguredInstanceForName<"Cards">;

    /**
     * The implementation of the Cards document configured through `CONFIG.Cards.documentClass` in Foundry and
     * {@link DocumentClassConfig | `DocumentClassConfig`} in fvtt-types.
     */
    type ImplementationClass = Document.ConfiguredClassForName<"Cards">;

    /**
     * A document's metadata is special information about the document ranging anywhere from its name,
     * whether it's indexed, or to the permissions a user has over it.
     */
    interface Metadata extends Document.MetadataFor<"Cards"> {}

    type SubType = Game.Model.TypeNames<"Cards">;
    type OfType<Type extends SubType> = HandleEmptyObject<ConfiguredCards<Type>, Cards<SubType>>;

    /**
     * A document's parent is something that can contain it.
     * For example an `Item` can be contained by an `Actor` which makes `Actor` one of its possible parents.
     */
    type Parent = null;

    /**
     * An instance of `Cards` that comes from the database.
     */
    interface Stored extends Document.Stored<Cards.Implementation> {}

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
     * The data put in {@link Cards._source | `Cards._source`}. This data is what was
     * persisted to the database and therefore it must be valid JSON.
     *
     * Both `Source` and `PersistedData` are equivalent.
     */
    interface PersistedData extends fields.SchemaField.PersistedData<Schema> {}

    /**
     * The data necessary to create a document. Used in places like {@link Cards.create | `Cards.create`}
     * and {@link Cards | `new Cards(...)`}.
     *
     * For example a {@link fields.SetField | `SetField`} can accept any {@link Iterable | `Iterable`}
     * with the right values. This means you can pass a `Set` instance, an array of values,
     * a generator, or any other iterable.
     */
    interface CreateData extends fields.SchemaField.CreateData<Schema> {}

    /**
     * The data after a {@link Document | `Document`} has been initialized, for example
     * {@link Cards.name | `Cards#name`}.
     *
     * This is data transformed from {@link Cards.Source | `Cards.Source`} and turned into more
     * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
     * persisted to the database as an array of values but at runtime it is a `Set` instance.
     */
    interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

    /**
     * The data used to update a document, for example {@link Cards.update | `Cards#update`}.
     * It is a distinct type from {@link Cards.CreateData | `DeepPartial<Cards.CreateData>`} because
     * it has different rules for `null` and `undefined`.
     */
    interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

    /**
     * The schema for {@link Cards | `Cards`}. This is the source of truth for how an Cards document
     * must be structured.
     *
     * Foundry uses this schema to validate the structure of the {@link Cards | `Cards`}. For example
     * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
     * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
     * starting as an array in the database, initialized as a set, and allows updates with any
     * iterable.
     */
    interface Schema extends DataSchema {
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
      type: fields.DocumentTypeField<typeof BaseCards>;

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

    namespace DatabaseOperation {
      /** Options passed along in Get operations for Cards Documents */
      interface Get extends foundry.abstract.types.DatabaseGetOperation<Cards.Parent> {}
      /** Options passed along in Create operations for Cards Documents */
      interface Create<Temporary extends boolean | undefined = boolean | undefined>
        extends foundry.abstract.types.DatabaseCreateOperation<Cards.CreateData, Cards.Parent, Temporary> {
        animate?: boolean;
      }
      /** Options passed along in Delete operations for Cards Documents */
      interface Delete extends foundry.abstract.types.DatabaseDeleteOperation<Cards.Parent> {
        animate?: boolean;
      }
      /** Options passed along in Update operations for Cards Documents */
      interface Update extends foundry.abstract.types.DatabaseUpdateOperation<Cards.UpdateData, Cards.Parent> {
        animate?: boolean;
      }

      /** Options for {@link Cards.createDocuments} */
      type CreateOperation<Temporary extends boolean | undefined = boolean | undefined> =
        Document.Database.CreateOperation<Create<Temporary>>;
      /** Options for {@link Cards._preCreateOperation} */
      type PreCreateOperationStatic = Document.Database.PreCreateOperationStatic<Create>;
      /** Options for {@link Cards#_preCreate} */
      type PreCreateOperationInstance = Document.Database.PreCreateOperationInstance<Create>;
      /** Options for {@link Cards#_onCreate} */
      type OnCreateOperation = Document.Database.OnCreateOperation<Create>;

      /** Options for {@link Cards.updateDocuments} */
      type UpdateOperation = Document.Database.UpdateOperation<Update>;
      /** Options for {@link Cards._preUpdateOperation} */
      type PreUpdateOperationStatic = Document.Database.PreUpdateOperationStatic<Update>;
      /** Options for {@link Cards#_preUpdate} */
      type PreUpdateOperationInstance = Document.Database.PreUpdateOperationInstance<Update>;
      /** Options for {@link Cards#_onUpdate} */
      type OnUpdateOperation = Document.Database.OnUpdateOperation<Update>;

      /** Options for {@link Cards.deleteDocuments} */
      type DeleteOperation = Document.Database.DeleteOperation<Delete>;
      /** Options for {@link Cards._preDeleteOperation} */
      type PreDeleteOperationStatic = Document.Database.PreDeleteOperationStatic<Delete>;
      /** Options for {@link Cards#_preDelete} */
      type PreDeleteOperationInstance = Document.Database.PreDeleteOperationInstance<Delete>;
      /** Options for {@link Cards#_onDelete} */
      type OnDeleteOperation = Document.Database.OnDeleteOperation<Delete>;
    }

    type CardsAction = "deal" | "pass";

    interface BaseOperationOptions {
      /**
       * Create a ChatMessage which notifies that this action has occurred
       * @defaultValue `true`
       */
      chatNotification: boolean | undefined;
    }

    interface DealOptions extends BaseOperationOptions {
      /**
       * How to draw, a value from CONST.CARD_DRAW_MODES
       * @defaultValue `foundry.CONST.CARD_DRAW_MODES.FIRST`
       */
      how: foundry.CONST.CARD_DRAW_MODES;

      /**
       * Modifications to make to each Card as part of the deal operation,
       * for example the displayed face
       * @defaultValue `{}`
       */
      updateData: DeepPartial<Cards["_source"]>;

      /**
       * The name of the action being performed, used as part of the dispatched Hook event
       * @defaultValue `"deal"`
       */
      action: CardsAction;
    }

    /** Additional context which describes the operation */
    interface DealContext {
      /** The action name being performed, i.e. "deal", "pass" */
      action: CardsAction;

      /** An array of Card creation operations to be performed in each destination Cards document */
      toCreate: Card["_source"][][];

      /** Card update operations to be performed in the origin Cards document */
      fromUpdate: { _id: string; drawn: true }[];

      /** Card deletion operations to be performed in the origin Cards document */
      fromDelete: string[];
    }

    interface PassOptions extends BaseOperationOptions {
      /**
       * Modifications to make to each Card as part of the pass operation,
       * for example the displayed face
       * @defaultValue `{}`
       */
      updateData: DeepPartial<Card["_source"]> | undefined;

      /**
       * The name of the action being performed, used as part of the dispatched Hook event
       * @defaultValue `"pass"`
       */
      action: string | undefined;

      /**
       * Create a ChatMessage which notifies that this action has occurred
       * @defaultValue `true`
       */
      chatNotification: boolean | undefined;
    }

    interface DrawOptions extends PassOptions {
      /**
       * How to draw, a value from CONST.CARD_DRAW_MODES
       * @defaultValue `foundry.CONST.CARD_DRAW_MODES.FIRST`
       */
      how: foundry.CONST.CARD_DRAW_MODES;

      /**
       * Modifications to make to each Card as part of the draw operation,
       * for example the displayed face
       * @defaultValue `{}`
       */
      updateData: DeepPartial<Card["_source"]>;
    }

    interface ShuffleOptions extends BaseOperationOptions {
      /**
       * Modifications to make to each Card as part of the shuffle operation,
       * for example the displayed face
       * @defaultValue `{}`
       */
      updateData: DeepPartial<Card["_source"]>;

      /** Create a ChatMessage which notifies that this action has occurred
       *  @defaultValue `true`
       */
      chatNotification: boolean | undefined;
    }

    /** Options which modify the reset operation */
    interface ResetOptions extends BaseOperationOptions {
      /**
       * Modifications to make to each Card as part of the reset operation,
       * for example the displayed face
       * @defaultValue `{}`
       */
      updateData: DeepPartial<Card["_source"]>;
    }

    /** Additional context which describes the operation. */
    interface ReturnContext {
      /**
       * A mapping of Card deck IDs to the update operations that
       * will be performed on them.
       */
      toUpdate: Record<string, DeepPartial<Card["_source"]>[]>;

      /**
       * Card deletion operations to be performed on the origin Cards
       * document.
       */
      fromDelete: string[];
    }

    /**
     * @deprecated {@link Cards.Types | `Cards.SubType`}
     */
    type TypeNames = Cards.SubType;

    /**
     * @deprecated {@link Cards.CreateData | `Cards.CreateData`}
     */
    interface ConstructorData extends Cards.CreateData {}

    /**
     * @deprecated {@link Cards.implementation | `Cards.ImplementationClass`}
     */
    type ConfiguredClass = ImplementationClass;

    /**
     * @deprecated {@link Cards.Implementation | `Cards.Implementation`}
     */
    type ConfiguredInstance = Implementation;
  }

  /**
   * The client-side Cards document which extends the common BaseCards model.
   * Each Cards document contains CardsData which defines its data schema.
   *
   * @see {@link CardStacks}                        The world-level collection of Cards documents
   * @see {@link CardsConfig}                       The Cards configuration application
   */
  class Cards<out SubType extends Cards.SubType = Cards.SubType> extends ClientDocumentMixin(
    foundry.documents.BaseCards,
  )<SubType> {
    static override metadata: Cards.Metadata;

    static get implementation(): Cards.ConfiguredClass;

    /**
     * Provide a thumbnail image path used to represent this document.
     */
    get thumbnail(): this["img"];

    /**
     * The Card documents within this stack which are able to be drawn.
     */
    get availableCards(): Card.ConfiguredInstance[];

    /**
     * The Card documents which belong to this stack but have already been drawn.
     */
    get drawnCards(): Card.ConfiguredInstance[];

    /**
     * Returns the localized Label for the type of Card Stack this is
     */
    get typeLabel(): string;

    /**
     * Can this Cards document be cloned in a duplicate workflow?
     */
    get canClone(): boolean;

    /**
     * Deal one or more cards from this Cards document to each of a provided array of Cards destinations.
     * Cards are allocated from the top of the deck in cyclical order until the required number of Cards have been dealt.
     * @param to      - An array of other Cards documents to which cards are dealt
     * @param number  - The number of cards to deal to each other document
     *                  (default: `1`)
     * @param options - (default: `{}`)
     * @returns This Cards document after the deal operation has completed
     */
    deal(
      to: Cards.ConfiguredInstance[],
      number?: number,
      options?: InexactPartial<Cards.DealOptions>,
    ): Promise<Cards.ConfiguredInstance>;

    /**
     * Pass an array of specific Card documents from this document to some other Cards stack.
     * @param to      - Some other Cards document that is the destination for the pass operation
     * @param ids     - The embedded Card ids which should be passed
     * @param options - Additional options which modify the pass operation
     *                  (default: `{}`)
     * @returns An array of the Card embedded documents created within the destination stack
     */
    pass(
      to: Cards.ConfiguredInstance,
      ids: string[],
      options?: InexactPartial<Cards.PassOptions>,
    ): Promise<Card.ConfiguredInstance[]>;

    /**
     * Draw one or more cards from some other Cards document.
     * @param from    - Some other Cards document from which to draw
     * @param number  - The number of cards to draw
     *                  (default: `1`)
     * @param options - (default: `{}`)
     * @returns An array of the Card documents which were drawn
     */
    draw(
      from: Cards.ConfiguredInstance,
      number?: number,
      options?: InexactPartial<Cards.DrawOptions>,
    ): Promise<Card.ConfiguredInstance[]>;

    /**
     * Shuffle this Cards stack, randomizing the sort order of all the cards it contains.
     * @param options - (default: `{}`)
     * @returns The Cards document after the shuffle operation has completed
     */
    shuffle(options?: InexactPartial<Cards.ShuffleOptions>): Promise<Cards.ConfiguredInstance>;

    /**
     * Reset the Cards stack, retrieving all original cards from other stacks where they may have been drawn if this is a
     * deck, otherwise returning all the cards in this stack to the decks where they originated.
     * @param options - Options which modify the reset operation
     *                  (default: `{}`)
     * @returns The Cards document after the reset operation has completed
     */
    reset(options?: InexactPartial<Cards.ResetOptions>): Promise<Cards.ConfiguredInstance>;

    /**
     * Perform a reset operation for a deck, retrieving all original cards from other stacks where they may have been
     * drawn.
     * @param options - Options which modify the reset operation.
     *                  (default: `{}`)
     * @returns The Cards document after the reset operation has completed.
     * @internal
     */
    protected _resetDeck(options?: InexactPartial<Cards.ResetOptions>): Promise<Cards.ConfiguredInstance>;

    /**
     * Return all cards in this stack to their original decks.
     * @param options - Options which modify the return operation.
     *                  (default: `{}`)
     * @returns The Cards document after the return operation has completed.
     * @internal
     */
    protected _resetStack(options?: InexactPartial<Cards.ResetOptions>): Promise<Cards.ConfiguredInstance>;

    /**
     * A sorting function that is used to determine the standard order of Card documents within an un-shuffled stack.
     * @param a - The card being sorted
     * @param b - Another card being sorted against
     */
    protected sortStandard(a: Card, b: Card): number;

    /**
     * A sorting function that is used to determine the order of Card documents within a shuffled stack.
     * @param a - The card being sorted
     * @param b - Another card being sorted against
     */
    protected sortShuffled(a: Card, b: Card): number;

    /**
     * An internal helper method for drawing a certain number of Card documents from this Cards stack.
     * @param number - The number of cards to draw
     * @param how    - A draw mode from CONST.CARD_DRAW_MODES
     * @returns An array of drawn Card documents
     */
    protected _drawCards(number: number, how: foundry.CONST.CARD_DRAW_MODES): Card.ConfiguredInstance[];

    /**
     * Create a ChatMessage which provides a notification of the cards operation which was just performed.
     * Visibility of the resulting message is linked to the default roll mode selected in the chat log dropdown.
     * @param source  - The source Cards document from which the action originated
     * @param action  - The localization key which formats the chat message notification
     * @param context - Data passed to the i18n.format method for the localization key
     * @returns A created ChatMessage document
     * @internal
     */
    protected _postChatNotification(
      source: Cards.ConfiguredInstance,
      action: string,
      context: Record<string, unknown>,
    ): Promise<ChatMessage.ConfiguredInstance | undefined>;

    /**
     * @privateRemarks _preCreate, _onUpdate, and _preDelete are all overridden but with no signature changes.
     * For type simplicity they are left off. These methods historically have been the source of a large amount of computation from tsc.
     */

    /**
     * Display a dialog which prompts the user to deal cards to some number of hand-type Cards documents.
     * @see {@link Cards#deal}
     */
    dealDialog(): Promise<Cards.ConfiguredInstance | null>;

    /**
     * Display a dialog which prompts the user to draw cards from some other deck-type Cards documents.
     * @see {@link Cards#draw}
     */
    drawDialog(): Promise<Card.ConfiguredInstance[] | null>;

    /**
     * Display a dialog which prompts the user to pass cards from this document to some other other Cards document.
     * @see {@link Cards#deal}
     */
    passDialog(): Promise<Cards.ConfiguredInstance | null>;

    /**
     * Display a dialog which prompts the user to play a specific Card to some other Cards document
     * @see {@link Cards#pass}
     * @param card - The specific card being played as part of this dialog
     */
    playDialog(card: Card.ConfiguredInstance): Promise<Card.ConfiguredInstance[] | void | null>;

    /**
     * Display a confirmation dialog for whether or not the user wishes to reset a Cards stack
     * @see {@link Cards#reset}
     */
    resetDialog(): Promise<Cards.ConfiguredInstance | false | null>;

    override deleteDialog(options?: Partial<DialogOptions>): Promise<this | false | null | undefined>;
  }
}
