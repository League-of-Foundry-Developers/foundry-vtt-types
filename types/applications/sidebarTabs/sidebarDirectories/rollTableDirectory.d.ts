/**
 * A directory list of RollTable entities in the Sidebar
 */
declare class RollTableDirectory extends SidebarDirectory {
  static get defaultOptions(): RollTableDirectory.Options;

  /**
   * Reference named Entity class which this directory lists
   */
  static get entity(): string;

  /**
   * Reference the EntityCollection of Entity instances which this directory lists
   */
  static get collection(): RollTables;
}

declare namespace RollTableDirectory {
  interface Options extends SidebarDirectory.Options {
    /**
     * @defaultValue `'tables'`
     */
    id: SidebarDirectory.Options['id'];
  }
}
