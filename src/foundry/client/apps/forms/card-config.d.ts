import type { ConfiguredDocumentClassForName, ConstructorDataType } from "../../../../types/helperTypes.js";
import type { CardFaceData } from "../../../common/data/module.mjs.js";

declare global {
  /**
   * A DocumentSheet application responsible for displaying and editing a single embedded Card document.
   *
   * @typeParam Options - The type of the options object
   */
  class CardConfig<Options extends DocumentSheetOptions<Card> = DocumentSheetOptions<Card>> extends DocumentSheet<
    Options,
    InstanceType<ConfiguredDocumentClassForName<"Card">>
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
    static override get defaultOptions(): DocumentSheetOptions<Card>;

    override getData(options?: Partial<Options>): MaybePromise<object>;

    override activateListeners(html: JQuery): void;

    protected override _getSubmitData(
      updateData?: object | null
    ): Record<string, unknown> & { faces: ConstructorDataType<CardFaceData>[] };

    /**
     * Handle card face control actions which modify single cards on the sheet.
     * @param event - The originating click event
     * @returns A Promise which resolves once the handler has completed
     */
    protected _onFaceControl(event: JQuery.ClickEvent): Promise<void>;
  }
}
