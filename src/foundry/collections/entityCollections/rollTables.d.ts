/**
 * The EntityCollection of RollTable entities
 */
declare class RollTables extends WorldCollection<RollTable> {
  /* -------------------------------------------- */
  /*  Properties                                  */
  /* -------------------------------------------- */

  /** @override */
  get entity(): string;

  /** @override */
  static get instance(): RollTables;

  /** @override */
  get directory(): RollTableDirectory;

  /**
   * Register world settings related to RollTable entities
   */
  static registerSettings(): void;
}
