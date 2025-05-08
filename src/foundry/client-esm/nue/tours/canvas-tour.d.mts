import type Tour from "../tour.mjs";

/**
 * A tour for demonstrating an aspect of Canvas functionality.
 * Automatically activates a certain canvas layer or tool depending on the needs of the step.
 */
declare class CanvasTour extends Tour {
  override start(): Promise<void>;
  override get canStart(): boolean;
  protected override _preStep(): Promise<void>;
}

declare namespace CanvasTour {}

export default CanvasTour;
