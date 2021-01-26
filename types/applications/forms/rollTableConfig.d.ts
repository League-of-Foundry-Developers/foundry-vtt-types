// @TODO:

/**
 * The RollTable configuration sheet
 *
 * @param table - The rollable table entity being configured
 * @param options - Additional application rendering options
 */
declare class RollTableConfig extends BaseEntitySheet {
  /**
   * Return a dynamic application title for the configuration sheet
   */
  get title(): string;

  /**
   * Activate event listeners for the RollTable Configuration Sheet
   */
  activateListeners(html: JQuery): void;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: any): BaseEntitySheet.Data<Entity>;
}
