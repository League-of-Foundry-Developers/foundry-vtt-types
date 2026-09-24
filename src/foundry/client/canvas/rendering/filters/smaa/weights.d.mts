import type { Identity } from "#utils";
import type SMAAFilter from "./smaa.d.mts";

/**
 * The blending weight calculation filter for {@linkcode foundry.canvas.rendering.filters.SMAAFilter}.
 */
declare class SMAABlendingWeightCalculationFilter extends PIXI.Filter {
  constructor(config: SMAABlendingWeightCalculationFilter.Config);
}

declare namespace SMAABlendingWeightCalculationFilter {
  interface Any extends AnySMAABlendingWeightCalculationFilter {}
  interface AnyConstructor extends Identity<typeof AnySMAABlendingWeightCalculationFilter> {}

  interface Config extends Omit<SMAAFilter.Config, "localContrastAdaptionFactor"> {}
}

export default SMAABlendingWeightCalculationFilter;

declare abstract class AnySMAABlendingWeightCalculationFilter extends SMAABlendingWeightCalculationFilter {
  constructor(...args: never);
}
