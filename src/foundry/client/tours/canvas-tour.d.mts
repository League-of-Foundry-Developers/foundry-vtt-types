import type { Tour } from "../core/tour.d.mts";

declare global {
  class CanvasTour extends Tour {
    override start(): Promise<void>;
    override get canStart(): boolean;
    protected override _preStep(): Promise<void>;
  }
}
