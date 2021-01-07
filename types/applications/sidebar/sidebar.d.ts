/**
 * Render the Sidebar container, and after rendering insert Sidebar tabs
 */
declare class Sidebar extends Application {
  /** Reference the name of the active tab */
  activeTab: string

  /** Sidebar application instance */
  apps: Application[]

  /** Sidebar navigation tabs */
  tabs: Tabs

  constructor (...args: any[])

  /**
   * Return an Array of pop-out sidebar tab Application instances
   */
  get popouts (): Application[]

  /**
   * Activate a Sidebar tab by it's name
   * @param tabName - The tab name corresponding to it's "data-tab" attribute
   */
  activateTab (tabName: string): void

  /**
   * Collapse the sidebar to a minimized state.
   * Take no action if the sidebar is already collapsed.
   */
  collapse (): void

  /**
   * Expand the Sidebar container from a collapsed state.
   * Take no action if the sidebar is already expanded.
   */
  expand (): void
}
