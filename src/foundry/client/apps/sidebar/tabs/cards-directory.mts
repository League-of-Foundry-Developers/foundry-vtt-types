declare global {
  /**
   * The sidebar directory which organizes and displays world-level Cards documents.
   */
  class CardsDirectory extends SidebarDirectory<"Cards"> {
    static override documentName: "Cards";
  }
}
