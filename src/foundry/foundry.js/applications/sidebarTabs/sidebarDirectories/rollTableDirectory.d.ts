/**
 * The sidebar directory which organizes and displays world-level RollTable documents.
 * @typeParam Options - The type of the options object
 */
declare class RollTableDirectory<
  Options extends SidebarDirectoryOptions = SidebarDirectoryOptions
> extends SidebarDirectory<'RollTable', Options> {
  /** @override */
  static documentName: 'RollTable';
}
