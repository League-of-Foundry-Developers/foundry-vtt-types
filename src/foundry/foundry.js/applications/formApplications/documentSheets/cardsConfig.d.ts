import type { ConfiguredDocumentClassForName } from '../../../../../types/helperTypes.js';

declare global {
  /**
   * A DocumentSheet application responsible for displaying and editing a single Cards stack.
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
     * });
     * ```
     */
    static override get defaultOptions(): DocumentSheetOptions;

    override getData(options?: Partial<Options>): Data;

    override activateListeners(html: JQuery<HTMLElement>): void;

    /**
     * Handle card control actions which modify single cards on the sheet.
     * @param event - The originating click event
     * @returns A Promise which resolves once the handler has completed
     */
    protected _onCardControl(event: MouseEvent): Promise<void>;

    /**
     * Handle lazy-loading card face images.
     * See {@link SidebarTab#_onLazyLoadImage}
     */
    protected _onLazyLoadImage(entries: IntersectionObserverEntry[], observer: IntersectionObserver): void;

    /** @param selector - (unused) */
    protected override _canDragStart(selector: string): boolean;

    protected override _onDragStart(event: DragEvent): void;

    /** @param selector - (unused) */
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
      card: Card
    ): ReturnType<InstanceType<ConfiguredDocumentClassForName<'Cards'>>['updateEmbeddedDocuments']>;
  }

  namespace CardsConfig {
    interface Data<Options extends DocumentSheetOptions>
      extends DocumentSheet.Data<InstanceType<ConfiguredDocumentClassForName<'Cards'>>, Options> {
      cards: InstanceType<ConfiguredDocumentClassForName<'Cards'>>;
      types: Record<string, string>;
      inCompendium: boolean;
    }
  }
}
