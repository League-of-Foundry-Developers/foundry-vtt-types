declare class CardsHand extends CardsConfig {
  /**
   * @defaultValue
   * ```typescript
   * foundry.utils.mergeObject(super.defaultOptions, {
   *   template: "templates/cards/cards-hand.html"
   * });
   * ```
   */
  static override get defaultOptions(): DocumentSheetOptions;
}
