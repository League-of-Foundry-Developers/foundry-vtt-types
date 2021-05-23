/**
 * The EntityCollection of RollTable entities
 */
declare class RollTables extends EntityCollection<RollTable> {
  /** @override */
  static get instance(): RollTables;

  /**
   * Register world settings related to RollTable entities
   */
  static registerSettings(): void;

  /** @override */
  get directory(): RollTableDirectory;

  /** @override */
  get entity(): string;
}
