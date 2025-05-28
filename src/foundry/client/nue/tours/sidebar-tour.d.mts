import type Tour from "../tour.mjs";

/**
 * A Tour subclass for the Sidebar Tour
 */
declare class SidebarTour extends Tour {
  override start(): Promise<void>;
  protected override _preStep(): Promise<void>;
}

declare namespace SidebarTour {}

export default SidebarTour;
