/**
 * The JournalEntry Configuration Sheet
 *
 * @param entity - The JournalEntry instance which is being edited
 * @param options - Application options
 */
declare class JournalSheet extends BaseEntitySheet {
  /**
   * Provide a unique CSS ID for Entity Sheets
   */
  get id(): string;

  /**
   * Suppress the JournalEntry title when an image is shown to players whom do not have at least limited permission
   */
  get title(): string;

  /**
   * @param options - (unused)
   * @override
   */
  getData(options?: any): BaseEntitySheet.Data<Entity>;
}
