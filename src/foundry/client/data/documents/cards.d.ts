import type {
  ConfiguredDocumentClass,
  ConfiguredDocumentClassForName,
  ConstructorDataType,
  DocumentConstructor
} from "../../../../types/helperTypes";
import type { DocumentModificationOptions } from "../../../common/abstract/document.mjs";

declare global {
  /**
   * The client-side Cards document which extends the common BaseCards model.
   * Each Cards document contains CardsData which defines its data schema.
   *
   * @see {@link data.CardsData}                     The Cards data schema
   * @see {@link CardStacks}                         The world-level collection of Cards documents
   */
  class Cards extends ClientDocumentMixin(foundry.documents.BaseCards) {
    /**
     * Provide a thumbnail image path used to represent this document.
     */
    get thumbnail(): string | null;

    /**
     * The Card documents within this stack which are able to be drawn.
     */
    get availableCards(): InstanceType<ConfiguredDocumentClassForName<"Card">>[];

    /**
     * The Card documents which belong to this stack but have already been drawn.
     */
    get drawnCards(): InstanceType<ConfiguredDocumentClassForName<"Card">>[];

    /**
     * Returns the localized Label for the type of Card Stack this is
     */
    get typeLabel(): string;

    static override createDocuments(
      data: Array<
        | ConstructorDataType<foundry.data.CardsData>
        | (ConstructorDataType<foundry.data.CardsData> & Record<string, unknown>)
      >,
      context: DocumentModificationContext & { temporary: false }
    ): Promise<StoredDocument<InstanceType<ConfiguredDocumentClassForName<"Cards">>>[]>;
    static createDocuments(
      data: Array<
        | ConstructorDataType<foundry.data.CardsData>
        | (ConstructorDataType<foundry.data.CardsData> & Record<string, unknown>)
      >,
      context: DocumentModificationContext & { temporary: boolean }
    ): Promise<InstanceType<ConfiguredDocumentClassForName<"Cards">>[]>;
    static createDocuments(
      data: Array<
        | ConstructorDataType<foundry.data.CardsData>
        | (ConstructorDataType<foundry.data.CardsData> & Record<string, unknown>)
      >,
      context?: DocumentModificationContext
    ): Promise<StoredDocument<InstanceType<ConfiguredDocumentClassForName<"Cards">>>[]>;

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
      to: InstanceType<ConfiguredDocumentClassForName<"Cards">>[],
      number?: number | undefined,
      options?: Cards.DealOptions | undefined
    ): Promise<InstanceType<ConfiguredDocumentClassForName<"Cards">>>;

    /**
     * Pass an array of specific Card documents from this document to some other Cards stack.
     * @param to      - Some other Cards document that is the destination for the pass operation
     * @param ids     - The embedded Card ids which should be passed
     * @param options - Additional options which modify the pass operation
     *                  (default: `{}`)
     * @returns An array of the Card embedded documents created within the destination stack
     */
    pass(
      to: InstanceType<ConfiguredDocumentClassForName<"Cards">>,
      ids: string[],
      options?: Cards.PassOptions | undefined
    ): Promise<InstanceType<ConfiguredDocumentClassForName<"Card">>[]>;

    /**
     * Draw one or more cards from some other Cards document.
     * @param from    - Some other Cards document from which to draw
     * @param number  - The number of cards to draw
     *                  (default: `1`)
     * @param options - (default: `{}`)
     * @returns An array of the Card documents which were drawn
     */
    draw(
      from: InstanceType<ConfiguredDocumentClassForName<"Cards">>,
      number?: number | undefined,
      options?: Cards.DrawOptions | undefined
    ): Promise<InstanceType<ConfiguredDocumentClassForName<"Card">>[]>;

    /**
     * Shuffle this Cards stack, randomizing the sort order of all the cards it contains.
     * @param options - (default: `{}`)
     * @returns The Cards document after the shuffle operation has completed
     */
    shuffle(options?: Cards.ShuffleOptions | undefined): Promise<InstanceType<ConfiguredDocumentClassForName<"Cards">>>;

    /**
     * Reset the Cards stack, retrieving all original cards from other stacks where they may have been drawn if this is a
     * deck, otherwise returning all the cards in this stack to the decks where they originated.
     * @param options - Options which modify the reset operation
     *                  (default: `{}`)
     * @returns The Cards document after the reset operation has completed
     */
    reset(options?: Cards.ResetOptions | undefined): Promise<InstanceType<ConfiguredDocumentClassForName<"Cards">>>;

    /**
     * Perform a reset operation for a deck, retrieving all original cards from other stacks where they may have been
     * drawn.
     * @param options - Options which modify the reset operation.
     *                  (default: `{}`)
     * @returns The Cards document after the reset operation has completed.
     * @internal
     */
    protected _resetDeck(
      options?: Cards.ResetOptions | undefined
    ): Promise<InstanceType<ConfiguredDocumentClassForName<"Cards">>>;

    /**
     * Return all cards in this stack to their original decks.
     * @param options - Options which modify the return operation.
     *                  (default: `{}`)
     * @returns The Cards document after the return operation has completed.
     * @internal
     */
    protected _resetStack(
      options?: Cards.ResetOptions | undefined
    ): Promise<InstanceType<ConfiguredDocumentClassForName<"Cards">>>;

    /**
     * A sorting function that is used to determine the standard order of Card documents within an un-shuffled stack.
     * @param a - The card being sorted
     * @param b - Another card being sorted against
     */
    protected sortStandard(a: foundry.data.CardData, b: foundry.data.CardData): number;

    /**
     * A sorting function that is used to determine the order of Card documents within a shuffled stack.
     * @param a - The card being sorted
     * @param b - Another card being sorted against
     */
    protected sortShuffled(a: foundry.data.CardData, b: foundry.data.CardData): number;

    /**
     * An internal helper method for drawing a certain number of Card documents from this Cards stack.
     * @param number - The number of cards to draw
     * @param how    - A draw mode from CONST.CARD_DRAW_MODES
     * @returns An array of drawn Card documents
     */
    protected _drawCards(
      number: number,
      how: foundry.CONST.CARD_DRAW_MODES
    ): InstanceType<ConfiguredDocumentClassForName<"Card">>[];

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
      source: InstanceType<ConfiguredDocumentClassForName<"Cards">>,
      action: string,
      context: Record<string, unknown>
    ): Promise<InstanceType<ConfiguredDocumentClassForName<"ChatMessage">> | undefined>;

    protected override _onUpdate(
      data: DeepPartial<foundry.data.CardsData>,
      options: DocumentModificationOptions,
      userId: string
    ): void;

    protected override _preDelete(
      options: DocumentModificationOptions,
      user: foundry.documents.BaseUser
    ): Promise<void>;

    // TODO: It's a bit weird that we have to do it in this generic way but otherwise there is an error overriding this. Investigate later.
    static override deleteDocuments<T extends DocumentConstructor>(
      this: T,
      ids?: string[] | undefined,
      context?: DocumentModificationContext | undefined
    ): Promise<InstanceType<ConfiguredDocumentClass<T>>[]>;

    /**
     * Display a dialog which prompts the user to deal cards to some number of hand-type Cards documents.
     * @see {@link Cards#deal}
     */
    dealDialog(): Promise<InstanceType<ConfiguredDocumentClassForName<"Cards">> | null>;

    /**
     * Display a dialog which prompts the user to draw cards from some other deck-type Cards documents.
     * @see {@link Cards#draw}
     */
    drawDialog(): Promise<InstanceType<ConfiguredDocumentClassForName<"Card">>[] | null>;

    /**
     * Display a dialog which prompts the user to pass cards from this document to some other other Cards document.
     * @see {@link Cards#deal}
     */
    passDialog(): Promise<InstanceType<ConfiguredDocumentClassForName<"Cards">> | null>;

    /**
     * Display a dialog which prompts the user to play a specific Card to some other Cards document
     * @see {@link Cards#pass}
     * @param card - The specific card being played as part of this dialog
     */
    playDialog(
      card: InstanceType<ConfiguredDocumentClassForName<"Card">>
    ): Promise<InstanceType<ConfiguredDocumentClassForName<"Card">>[] | void | null>;

    /**
     * Display a confirmation dialog for whether or not the user wishes to reset a Cards stack
     * @see {@link Cards#reset}
     */
    resetDialog(): Promise<InstanceType<ConfiguredDocumentClassForName<"Cards">> | false | null>;

    override deleteDialog(options?: Partial<DialogOptions> | undefined): Promise<this | false | null | undefined>;

    // TODO: It's a bit weird that we have to do it in this generic way but otherwise there is an error overriding this. Investigate later.
    static override createDialog<T extends DocumentConstructor>(
      this: T,
      data?:
        | DeepPartial<
            | ConstructorDataType<foundry.data.CardsData>
            | (ConstructorDataType<foundry.data.CardsData> & Record<string, unknown>)
          >
        | undefined,
      context?: (Pick<DocumentModificationContext, "parent" | "pack"> & Partial<DialogOptions>) | undefined
    ): Promise<InstanceType<ConfiguredDocumentClass<T>> | null | undefined>;
  }

  namespace Cards {
    interface BaseOperationOptions {
      /**
       * Create a ChatMessage which notifies that this action has occurred
       * @defaultValue `true`
       */
      chatNotification?: boolean | undefined;
    }

    interface DealOptions extends BaseOperationOptions {
      /**
       * How to draw, a value from CONST.CARD_DRAW_MODES
       * @defaultValue `foundry.CONST.CARD_DRAW_MODES.FIRST`
       */
      how?: foundry.CONST.CARD_DRAW_MODES | undefined;

      /**
       * Modifications to make to each Card as part of the deal operation,
       * for example the displayed face
       * @defaultValue `{}`
       */
      updateData?: DeepPartial<ConstructorDataType<foundry.data.CardData>> | undefined;

      /**
       * The name of the action being performed, used as part of the dispatched Hook event
       * @defaultValue `"deal"`
       */
      action?: string | undefined;
    }

    /** Additional context which describes the operation */
    interface DealContext {
      /** The action name being performed, i.e. "deal", "pass" */
      action: string;

      /** An array of Card creation operations to be performed in each destination Cards document */
      toCreate: ConstructorDataType<foundry.data.CardData>[][];

      /** Card update operations to be performed in the origin Cards document */
      fromUpdate: DeepPartial<ConstructorDataType<foundry.data.CardData>>[];

      /** Card deletion operations to be performed in the origin Cards document */
      fromDelete: string[];
    }

    interface PassOptions extends BaseOperationOptions {
      /**
       * Modifications to make to each Card as part of the pass operation,
       * for example the displayed face
       * @defaultValue `{}`
       */
      updateData?: DeepPartial<ConstructorDataType<foundry.data.CardData>> | undefined;

      /**
       * The name of the action being performed, used as part of the dispatched Hook event
       * @defaultValue `"pass"`
       */
      action?: string | undefined;
    }

    /** Additional context which describes the operation */
    interface PassContext {
      /** The action name being performed, i.e. "pass", "play", "discard", "draw" */
      action: string;

      /** Card creation operations to be performed in the destination Cards document */
      toCreate: ConstructorDataType<foundry.data.CardData>[];

      /** Card update operations to be performed in the destination Cards document */
      toUpdate: DeepPartial<ConstructorDataType<foundry.data.CardData>>[];

      /** Card update operations to be performed in the origin Cards document */
      fromUpdate: DeepPartial<ConstructorDataType<foundry.data.CardData>>[];

      /** Card deletion operations to be performed in the origin Cards document */
      fromDelete: string[];
    }

    interface DrawOptions extends PassOptions {
      /**
       * How to draw, a value from CONST.CARD_DRAW_MODES
       * @defaultValue `foundry.CONST.CARD_DRAW_MODES.FIRST`
       */
      how?: foundry.CONST.CARD_DRAW_MODES | undefined;

      /**
       * Modifications to make to each Card as part of the draw operation,
       * for example the displayed face
       * @defaultValue `{}`
       */
      updateData?: DeepPartial<ConstructorDataType<foundry.data.CardData>> | undefined;
    }

    interface ShuffleOptions extends BaseOperationOptions {
      /**
       * Modifications to make to each Card as part of the shuffle operation,
       * for example the displayed face
       * @defaultValue `{}`
       * @remarks This is not actually used by {@link Cards.shuffle}.
       */
      updateData?: DeepPartial<ConstructorDataType<foundry.data.CardData>> | undefined;
    }

    /** Options which modify the reset operation */
    interface ResetOptions extends BaseOperationOptions {
      /**
       * Modifications to make to each Card as part of the reset operation,
       * for example the displayed face
       * @defaultValue `{}`
       */
      updateData?: DeepPartial<ConstructorDataType<foundry.data.CardData>> | undefined;
    }

    /** Additional context which describes the operation. */
    interface ReturnContext {
      /**
       * A mapping of Card deck IDs to the update operations that
       * will be performed on them.
       */
      toUpdate: Record<string, DeepPartial<ConstructorDataType<foundry.data.CardData>>[]>;

      /**
       * Card deletion operations to be performed on the origin Cards
       * document.
       */
      fromDelete: string[];
    }
  }
}
