/**
 * The sidebar directory which organizes and displays world-level RollTable documents.
 * @typeParam Options - The type of the options object
 */
declare class RollTableDirectory<
  Options extends SidebarDirectory.Options = SidebarDirectory.Options
> extends SidebarDirectory<'RollTable', Options> {
  static get defaultOptions(): SidebarDirectory.Options;

  /** @override */
  static documentName: 'RollTable';
}
