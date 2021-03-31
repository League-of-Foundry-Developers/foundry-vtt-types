/**
 * A directory list of RollTable entities in the Sidebar
 */
declare class RollTableDirectory extends SidebarDirectory<RollTableDirectory.Options> {
  static get defaultOptions(): RollTableDirectory.Options;

  /**
   * Reference named Entity class which this directory lists
   */
  static get entity(): 'RollTable';

  /**
   * Reference the EntityCollection of Entity instances which this directory lists
   * @see {@link Game.tables}
   */
  static get collection(): Game['tables'];
}

declare namespace RollTableDirectory {
  interface Options extends SidebarDirectory.Options {
    /**
     * @defaultValue `'tables'`
     */
    id: string;

    /**
     * @defaultValue `'templates/sidebar/roll-table-directory.html'`
     */
    template: string;

    /**
     * @defaultValue `'Rollable Tables Directory'`
     */
    title: string;
  }
}
