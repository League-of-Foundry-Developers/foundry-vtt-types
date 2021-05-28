// TODO: Remove when updating this class!!!
// eslint-disable-next-line
// @ts-nocheck

/**
 * The EntityCollection of RollTable entities
 */
declare class RollTables extends EntityCollection<RollTable> {
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
