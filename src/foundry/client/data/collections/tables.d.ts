/**
 * The singleton collection of RollTable documents which exist within the active World.
 * This Collection is accessible within the Game object as game.tables.
 *
 * @see {@link RollTable} The RollTable document
 * @see {@link RollTableDirectory} The RollTableDirectory sidebar directory
 */
declare class RollTables extends WorldCollection<typeof foundry.documents.BaseRollTable, "RollTables"> {
  static override documentName: "RollTable";

  override get directory(): typeof ui["tables"];

  /**
   * Register world settings related to RollTable documents
   */
  static registerSettings(): void;
}
