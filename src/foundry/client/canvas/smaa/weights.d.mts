import type { Identity, IntentionalPartial, RequiredProps } from "#utils";

/**
 * The blending weight calculation filter for {@linkcode foundry.canvas.SMAAFilter}.
 */
declare class SMAABWeightCalculationFilter extends PIXI.Filter {
  constructor(config: SMAABWeightCalculationFilter.Config);
}

declare namespace SMAABWeightCalculationFilter {
  interface Any extends AnySMAABWeightCalculationFilter {}
  interface AnyConstructor extends Identity<typeof AnySMAABWeightCalculationFilter> {}

  type Config = RequiredProps<
    IntentionalPartial<foundry.canvas.SMAAFilter.Config>,
    | "maxSearchSteps"
    | "threshold"
    | "maxSearchStepsDiag"
    | "cornerRounding"
    | "disableCornerDetection"
    | "disableDiagDetection"
  >;
}

declare abstract class AnySMAABWeightCalculationFilter extends SMAABWeightCalculationFilter {
  constructor(...args: never);
}

export default SMAABWeightCalculationFilter;
