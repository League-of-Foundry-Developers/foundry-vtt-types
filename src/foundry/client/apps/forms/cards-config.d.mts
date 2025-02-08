import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";
import type Document from "../../../common/abstract/document.d.mts";

declare global {
  /**
   * A DocumentSheet application responsible for displaying and editing a single Cards stack.
   *
   * @typeParam Options - The type of the options object
   */
  class CardsConfig<Options extends CardsConfig.Options = CardsConfig.Options> extends DocumentSheet<
    Options,
    Cards.ConfiguredInstance
  > {
    constructor(object: Document.ConfiguredClassForName<"Cards">, options: Options);

    /**
     * The allowed sorting methods which can be used for this sheet
     */
    static SORT_TYPES: {
      STANDARD: "standard";
      SHUFFLED: "shuffled";
    };

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   classes: ["sheet", "cards-config"],
     *   template: "templates/cards/cards-deck.html",
     *   width: 620,
     *   height: "auto",
     *   closeOnSubmit: false,
     *   viewPermission: CONST.DOCUMENT_OWNERSHIP_LEVELS.OBSERVER,
     *   dragDrop: [{dragSelector: "ol.cards li.card", dropSelector: "ol.cards"}],
     *   tabs: [{navSelector: ".tabs", contentSelector: "form", initial: "cards"}],
     *   scrollY: ["ol.cards"],
     *   sort: this.SORT_TYPES.SHUFFLED
     * })
     * ```
     */
    static override get defaultOptions(): CardsConfig.Options;

    override getData(options?: Partial<Options>): MaybePromise<GetDataReturnType<CardsConfig.CardsConfigData>>;

    override activateListeners(html: JQuery): void;

    /**
     * Handle card control actions which modify single cards on the sheet.
     * @param event - The originating click event
     * @returns A Promise which resolves once the handler has completed
     */
    protected _onCardControl(event: JQuery.ClickEvent): Promise<void>;

    /**
     * Handle lazy-loading card face images.
     * See {@link SidebarTab#_onLazyLoadImage}
     * @param entries  - The entries which are now in the observer frame
     * @param observer - The intersection observer instance
     */
    protected _onLazyLoadImage(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void;

    protected override _canDragStart(selector: string): boolean;

    protected override _onDragStart(event: DragEvent): void;

    protected override _canDragDrop(selector: string): boolean;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    protected override _onDrop(event: DragEvent): Promise<void>;

    /**
     * Handle sorting a Card relative to other siblings within this document
     * @param event - The drag drop event
     * @param card  - The card being dragged
     * @internal
     */
    protected _onSortCard(
      event: DragEvent,
      card: Card.ConfiguredInstance,
    ): ReturnType<Cards.ConfiguredInstance["updateEmbeddedDocuments"]>;
  }

  namespace CardsConfig {
    type Any = CardsConfig<any>;
  }

  /**
   * A subclass of CardsConfig which provides a sheet representation for Cards documents with the "hand" type.
   *
   * @typeParam Options - The type of the options object
   */
  class CardsHand<Options extends CardsConfig.Options = CardsConfig.Options> extends CardsConfig<Options> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   template: "templates/cards/cards-hand.html"
     * })
     * ```
     */
    static override get defaultOptions(): CardsConfig.Options;
  }

  namespace CardsHand {
    type Any = CardsHand<any>;
  }

  /**
   * A subclass of CardsConfig which provides a sheet representation for Cards documents with the "pile" type.
   *
   * @typeParam Options - The type of the options object
   */
  class CardsPile<Options extends CardsConfig.Options = CardsConfig.Options> extends CardsConfig<Options> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   template: "templates/cards/cards-pile.html"
     * })
     * ```
     */
    static override get defaultOptions(): CardsConfig.Options;
  }

  namespace CardsPile {
    type Any = CardsPile<any>;
  }

  namespace CardsConfig {
    interface Options extends DocumentSheetOptions<Cards.ConfiguredInstance> {
      sort: string;
    }

    interface CardsConfigData<Options extends CardsConfig.Options = CardsConfig.Options>
      extends DocumentSheet.DocumentSheetData<Options, Cards.ConfiguredInstance> {
      cards: Card.ConfiguredInstance[];
      //TODO: Find if we can better type this
      types: Record<string, string>;
      inCompendium: boolean;
    }
  }
}
