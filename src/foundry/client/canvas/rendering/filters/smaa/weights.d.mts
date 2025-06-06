import type { Identity } from "#utils";
import type SMAAFilter from "./smaa.d.mts";

/**
 * The blending weight calculation filter for {@linkcode foundry.canvas.rendering.filters.SMAAFilter}.
 */
declare class SMAABWeightCalculationFilter extends PIXI.Filter {
  constructor(config: SMAABWeightCalculationFilter.Config);
}

declare namespace SMAABWeightCalculationFilter {
  interface Any extends AnySMAABWeightCalculationFilter {}
  interface AnyConstructor extends Identity<typeof AnySMAABWeightCalculationFilter> {}

  interface Config extends Omit<SMAAFilter.Config, "localContrastAdaptionFactor"> {}
}

export default SMAABWeightCalculationFilter;

declare abstract class AnySMAABWeightCalculationFilter extends SMAABWeightCalculationFilter {
  constructor(...args: never);
}
