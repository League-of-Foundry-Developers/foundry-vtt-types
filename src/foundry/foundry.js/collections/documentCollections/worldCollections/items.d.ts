/**
 * The Collection of Item documents which exist within the active World.
 * This Collection is accessible within the Game object as game.items.
 *
 * @see {@link Item} The Item entity
 * @see {@link ItemDirectory} The ItemDirectory sidebar directory
 */
declare class Items extends WorldCollection<typeof foundry.documents.BaseItem, 'Items'> {
  /** @override */
  static documentName: 'Item';

  /**
   * Register an Item sheet class as a candidate which can be used to display Items of a given type
   * See EntitySheetConfig.registerSheet for details
   */
  static registerSheet(
    scope: string,
    sheetClass: ConstructorOf<ItemSheet>,
    { label, types, makeDefault }?: { label?: string; types?: string[]; makeDefault?: boolean }
  ): void;

  /**
   * Unregister an Item sheet class, removing it from the list of available sheet Applications to use
   * See EntitySheetConfig.unregisterSheet for details
   */
  static unregisterSheet(scope: string, sheetClass: ConstructorOf<ItemSheet>, { types }?: { types?: string[] }): void;

  /**
   * Return an Array of currently registered sheet classes for this Entity type
   */
  static get registeredSheets(): ItemSheet[];
}
