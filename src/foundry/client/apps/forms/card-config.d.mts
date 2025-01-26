import type { GetDataReturnType, MaybePromise } from "fvtt-types/utils";

declare global {
  /**
   * A DocumentSheet application responsible for displaying and editing a single embedded Card document.
   *
   * @typeParam Options - The type of the options object
   */
  class CardConfig<
    Options extends DocumentSheetOptions<Card.ConfiguredInstance> = DocumentSheetOptions<Card.ConfiguredInstance>,
  > extends DocumentSheet<Options, Card.ConfiguredInstance> {
    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   classes: ["sheet", "card-config"],
     *   template: "templates/cards/card-config.html",
     *   width: 480,
     *   height: "auto",
     *   tabs: [{navSelector: ".tabs", contentSelector: "form", initial: "details"}]
     * })
     * ```
     */
    static override get defaultOptions(): DocumentSheetOptions<Card.ConfiguredInstance>;

    override getData(options?: Partial<Options>): MaybePromise<GetDataReturnType<CardConfig.CardConfigData>>;

    override activateListeners(html: JQuery): void;

    /**
     * Handle card face control actions which modify single cards on the sheet.
     * @param event - The originating click event
     * @returns A Promise which resolves once the handler has completed
     */
    protected _onFaceControl(event: JQuery.ClickEvent): Promise<unknown>;
  }

  namespace CardConfig {
    type Any = CardConfig<any>;

    interface CardConfigData<
      Options extends DocumentSheetOptions<Card.ConfiguredInstance> = DocumentSheetOptions<Card.ConfiguredInstance>,
    > extends DocumentSheet.DocumentSheetData<Options, Card.ConfiguredInstance> {
      //TODO: Find if we can better type this
      types: Record<string, string>;
    }
  }
}
