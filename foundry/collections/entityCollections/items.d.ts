/**
 * The Collection of Item entities
 * The items collection is accessible within the game as game.items
 */
declare class Items extends EntityCollection<Item> {
  /**
   * Return an Array of currently registered sheet classes for this Entity type
   */
  static get registeredSheets(): Array<ConstructorOf<ItemSheet>>;

  /**
   * Register an Actor sheet class as a candidate which can be used to display Actors of a given type
   * See EntitySheetConfig.registerSheet for details
   */
  static registerSheet(
    scope: string,
    sheetClass: ConstructorOf<Application>,
    {
      label,
      types,
      makeDefault
    }?: {
      label?: string;
      types?: string[];
      makeDefault?: boolean;
    }
  ): void;

  /**
   * Unregister an Actor sheet class, removing it from the list of avaliable sheet Applications to use
   * See EntitySheetConfig.unregisterSheet for details
   */
  static unregisterSheet(
    scope: string,
    sheetClass: ConstructorOf<Application>,
    {
      types
    }?: {
      types?: string[];
    }
  ): void;

  /** @override */
  get entity(): string;
}
