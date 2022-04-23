import type { ConfiguredDocumentClassForName } from '../../../../types/helperTypes.js';

declare global {
  /**
   * A DocumentSheet application responsible for displaying and editing a single Cards stack.
   *
   * @typeParam Options - The type of the options object
   * @typeParam Data    - The data structure used to render the handlebars template.
   */
  class CardsConfig<
    Options extends DocumentSheetOptions = DocumentSheetOptions,
    Data extends CardsConfig.Data<Options> = CardsConfig.Data<Options>
  > extends DocumentSheet<Options, Data, InstanceType<ConfiguredDocumentClassForName<'Cards'>>> {
    constructor(object: ConfiguredDocumentClassForName<'Cards'>, options: Options);

    /**
     * The sorting mode used to display the sheet, "standard" if true, otherwise "shuffled"
     * @internal
     * @defaultValue `false`
     */
    protected _sortStandard: boolean;

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   classes: ["sheet", "cards-config"],
     *   template: "templates/cards/cards-deck.html",
     *   width: 620,
     *   height: "auto",
     *   closeOnSubmit: false,
     *   viewPermission: CONST.DOCUMENT_PERMISSION_LEVELS.OBSERVER,
     *   dragDrop: [{dragSelector: "ol.cards li.card", dropSelector: "ol.cards"}],
     *   tabs: [{navSelector: ".tabs", contentSelector: "form", initial: "cards"}],
     *   scrollY: ["ol.cards"]
     * })
     * ```
     */
    static override get defaultOptions(): DocumentSheetOptions;

    override getData(options?: Partial<Options>): Data | Promise<Data>;

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
     */
    protected _onLazyLoadImage(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void;

    protected override _canDragStart(selector: string): boolean;

    protected override _onDragStart(event: DragEvent): void;

    protected override _canDragDrop(selector: string): boolean;

    protected override _onDrop(event: DragEvent): void;

    /**
     * Handle sorting a Card relative to other siblings within this document
     * @param event - The drag drop event
     * @param card  - The card being dragged
     * @internal
     */
    protected _onSortCard(
      event: DragEvent,
      card: InstanceType<ConfiguredDocumentClassForName<'Card'>>
    ): ReturnType<InstanceType<ConfiguredDocumentClassForName<'Cards'>>['updateEmbeddedDocuments']>;
  }

  /**
   * A subclass of CardsConfig which provides a sheet representation for Cards documents with the "hand" type.
   *
   * @typeParam Options - The type of the options object
   * @typeParam Data    - The data structure used to render the handlebars template.
   */
  class CardsHand<
    Options extends DocumentSheetOptions = DocumentSheetOptions,
    Data extends CardsConfig.Data<Options> = CardsConfig.Data<Options>
  > extends CardsConfig<Options, Data> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   template: "templates/cards/cards-hand.html"
     * })
     * ```
     */
    static override get defaultOptions(): DocumentSheetOptions;
  }

  /**
   * A subclass of CardsConfig which provides a sheet representation for Cards documents with the "pile" type.
   *
   * @typeParam Options - The type of the options object
   * @typeParam Data    - The data structure used to render the handlebars template.
   */
  class CardsPile<
    Options extends DocumentSheetOptions = DocumentSheetOptions,
    Data extends CardsConfig.Data<Options> = CardsConfig.Data<Options>
  > extends CardsConfig<Options, Data> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   template: "templates/cards/cards-pile.html"
     * })
     * ```
     */
    static override get defaultOptions(): DocumentSheetOptions;
  }

  namespace CardsConfig {
    interface Data<Options extends DocumentSheetOptions>
      extends DocumentSheet.Data<InstanceType<ConfiguredDocumentClassForName<'Cards'>>, Options> {
      cards: InstanceType<ConfiguredDocumentClassForName<'Card'>>[];
      types: Record<string, string>;
      inCompendium: boolean;
    }
  }
}
