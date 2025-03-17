export {};

declare global {
  /**
   * The sidebar directory which organizes and displays world-level RollTable documents.
   * @typeParam Options - The type of the options object
   */
  class RollTableDirectory extends DocumentDirectory<"RollTable"> {
    static override documentName: "RollTable";

    protected override _getEntryContextOptions(): ContextMenu.Entry[];
  }

  namespace RollTableDirectory {
    type Any = AnyRollTableDirectory;
    type AnyConstructor = typeof AnyRollTableDirectory;
  }
}

declare abstract class AnyRollTableDirectory extends RollTableDirectory {
  constructor(arg0: never, ...args: never[]);
}
