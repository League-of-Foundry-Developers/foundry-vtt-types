// FOUNDRY_VERSION: 10.291

import type BaseCard from "../../../common/documents/card.mjs";

declare global {
  /**
   * The client-side Card document which extends the common BaseCard model.
   * Each Card document contains CardData which defines its data schema.
   *
   * @see {@link data.CardData}                      The Card data schema
   * @see {@link documents.Cards}                    The Cards document type which contains Card embedded documents
   */
  class Card extends ClientDocumentMixin(BaseCard) {
    /**
     * The current card face
     */
    get currentFace(): CardFaceData | null;

    /**
     * The image of the currently displayed card face or back
     */
    get img(): string;

    /**
     * A reference to the source Cards document which defines this Card.
     */
    get source(): Cards | null;

    /**
     * A convenience property for whether the Card is within its source Cards stack. Cards in decks are always
     * considered home.
     */
    get isHome(): boolean;

    /**
     * Whether to display the face of this card?
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
     * @param face    - A specific face to flip the card to
     * @returns       A reference to this card after the flip operation is complete
     */
    flip(face?: number | null): Promise<Card>;

    /**
     * Pass this Card to some other Cards document.
     * @param to          - A new Cards document this card should be passed to
     * @param options     - Options which modify the pass operation
     *                    (default: `{}`)
     * @returns           A reference to this card after it has been passed to another parent document
     */
    pass(to: Cards, options?: Cards.PassOptions | undefined): Promise<Card>;

    /**
     * @see Card#pass
     */
    play(to: Cards, options?: Cards.PassOptions | undefined): Promise<Card>;

    /**
     * @see Card#pass
     */
    discard(to: Cards, options?: Cards.PassOptions | undefined): Promise<Card>;

    /**
     * Recall this Card to its original Cards parent.
     * @param options     - Options which modify the recall operation
     *                    (default: `{}`)
     * @returns           A reference to the recalled card belonging to its original parent
     */
    recall(options?: Cards.RecallOptions): Promise<Card>;

    /**
     * Create a chat message which displays this Card.
     * @param messageData   - Additional data which becomes part of the created ChatMessageData
     *                      (default: `{}`)
     * @param options       - Options which modify the message creation operation
     *                      (default: `{}`)
     * @returns             The created chat message
     */
    toMessage(messageData?: ChatMessageData, options?: DocumentModificationContext): Promise<ChatMessage>;
  }
}
