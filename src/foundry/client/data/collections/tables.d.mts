export {};

declare global {
  /**
   * The singleton collection of RollTable documents which exist within the active World.
   * This Collection is accessible within the Game object as game.tables.
   *
   * @see {@link RollTable} The RollTable document
   * @see {@link RollTableDirectory} The RollTableDirectory sidebar directory
   */
  class RollTables extends WorldCollection<RollTable.ImplementationClass, "RollTables"> {
    static documentName: "RollTable";

    override get directory(): typeof ui.tables;

    /**
     * Register world settings related to RollTable documents
     */
    static registerSettings(): void;
  }

  namespace RollTables {
    type Any = AnyRollTables;
    type AnyConstructor = typeof AnyRollTables;
  }
}

declare abstract class AnyRollTables extends RollTables {
  constructor(arg0: never, ...args: never[]);
}
