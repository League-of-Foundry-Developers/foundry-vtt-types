import type { ConfiguredDocumentClassForName, ConstructorDataType } from '../../../../types/helperTypes.js';
import type { CardFaceData } from '../../../common/data/module.mjs.js';

declare global {
  /**
   * A DocumentSheet application responsible for displaying and editing a single embedded Card document.
   *
   * @typeParam Options - The type of the options object
   * @typeParam Data    - The data structure used to render the handlebars template.
   */
  class CardConfig<
    Options extends DocumentSheetOptions = DocumentSheetOptions,
    Data extends CardConfig.Data<Options> = CardConfig.Data<Options>
  > extends DocumentSheet<Options, Data, InstanceType<ConfiguredDocumentClassForName<'Card'>>> {
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
    static override get defaultOptions(): DocumentSheetOptions;

    override getData(options?: Partial<Options>): Data | Promise<Data>;

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

  namespace CardConfig {
    interface Data<Options extends DocumentSheetOptions>
      extends DocumentSheet.Data<InstanceType<ConfiguredDocumentClassForName<'Card'>>, Options> {
      types: Record<string, string>;
    }
  }
}
