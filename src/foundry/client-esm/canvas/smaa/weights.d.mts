import type { Identity, IntentionalPartial, RequiredProps } from "../../../../utils/index.d.mts";

/**
 * The blending weight calculation filter for {@link foundry.canvas.SMAAFilter | `foundry.canvas.SMAAFilter`}.
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
  constructor(arg0: never, ...args: never[]);
}

export default SMAABWeightCalculationFilter;
