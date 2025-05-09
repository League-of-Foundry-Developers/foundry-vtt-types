import type { GetDataReturnType, MaybePromise, Identity } from "fvtt-types/utils";

declare global {
  /**
   * A DocumentSheet application responsible for displaying and editing a single embedded Card document.
   *
   * @template Options - The type of the options object
   */
  class CardConfig<Options extends CardConfig.Options = CardConfig.Options> extends DocumentSheet<
    Card.Implementation,
    Options
  > {
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
    static override get defaultOptions(): CardConfig.Options;

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
    interface Any extends AnyCardConfig {}
    interface AnyConstructor extends Identity<typeof AnyCardConfig> {}

    interface Options extends DocumentSheet.Options<Card.Implementation> {}

    interface CardConfigData<
      Options extends DocumentSheet.Options<Card.Implementation> = DocumentSheet.Options<Card.Implementation>,
    > extends DocumentSheet.DocumentSheetData<Options, Card.Implementation> {
      // TODO: Find if we can better type this
      types: Record<string, string>;
    }
  }
}

declare abstract class AnyCardConfig extends CardConfig<CardConfig.Options> {
  constructor(...args: never);
}
