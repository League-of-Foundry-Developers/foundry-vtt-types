declare class CardsPile extends CardsConfig {
  /**
   * @defaultValue
   * ```typescript
   * foundry.utils.mergeObject(super.defaultOptions, {
   *   template: "templates/cards/cards-pile.html"
   * });
   * ```
   */
  static override get defaultOptions(): DocumentSheetOptions;
}
