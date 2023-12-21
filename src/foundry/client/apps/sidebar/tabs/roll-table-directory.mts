declare global {
  /**
   * The sidebar directory which organizes and displays world-level RollTable documents.
   * @typeParam Options - The type of the options object
   */
  class RollTableDirectory<
    Options extends SidebarDirectory.Options = SidebarDirectory.Options,
  > extends SidebarDirectory<"RollTable", Options> {
    static override documentName: "RollTable";
  }
}
