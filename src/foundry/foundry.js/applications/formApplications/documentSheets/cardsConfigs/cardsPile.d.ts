/**
 * A subclass of CardsConfig which provides a sheet representation for Cards documents with the "pile" type.
 *
 * @typeParam Options - The type of the options object
 * @typeParam Data    - The data structure used to render the handlebars template.
 */
declare class CardsPile<
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
