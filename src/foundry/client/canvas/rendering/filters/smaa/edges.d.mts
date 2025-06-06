import type { Identity } from "#utils";
import type SMAAFilter from "./smaa.d.mts";

/**
 * The edge detection filter for {@linkcode foundry.canvas.rendering.filters.SMAAFilter}.
 */
declare class SMAAEdgeDetectionFilter extends PIXI.Filter {
  constructor(config: SMAAEdgeDetectionFilter.Config);
}

declare namespace SMAAEdgeDetectionFilter {
  interface Any extends AnySMAAEdgeDetectionFilter {}
  interface AnyConstructor extends Identity<typeof AnySMAAEdgeDetectionFilter> {}

  interface Config extends Pick<SMAAFilter.Config, "threshold" | "localContrastAdaptionFactor"> {}
}

export default SMAAEdgeDetectionFilter;

declare abstract class AnySMAAEdgeDetectionFilter extends SMAAEdgeDetectionFilter {
  constructor(...args: never);
}
