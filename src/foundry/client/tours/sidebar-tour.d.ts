import { Tour } from "../core/tour";

declare global {
  class SidebarTour extends Tour {
    override start(): Promise<void>;
    protected override _preStep(): Promise<void>;
    _updateSidebarTab(): Promise<void>;
  }
}
