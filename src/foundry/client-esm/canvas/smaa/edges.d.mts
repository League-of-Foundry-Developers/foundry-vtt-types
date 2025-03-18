import type { IntentionalPartial, RequiredProps } from "../../../../utils/index.d.mts";

/**
 * The edge detection filter for {@link foundry.canvas.SMAAFilter | `foundry.canvas.SMAAFilter`}.
 */
declare class SMAAEdgeDetectionFilter extends PIXI.Filter {
  constructor(config: SMAAEdgeDetectionFilter.Config);
}

declare namespace SMAAEdgeDetectionFilter {
  interface Any extends AnySMAAEdgeDetectionFilter {}
  type AnyConstructor = typeof AnySMAAEdgeDetectionFilter;

  /**
   * @privateRemarks The SMAAEdgeDetectionFilter constructor passes `config` to an unexported local
   * function that only uses two properties of the interface
   */
  type Config = RequiredProps<
    IntentionalPartial<foundry.canvas.SMAAFilter.Config>,
    "threshold" | "localContrastAdaptionFactor"
  >;
}

declare abstract class AnySMAAEdgeDetectionFilter extends SMAAEdgeDetectionFilter {
  constructor(arg0: never, ...args: never[]);
}

export default SMAAEdgeDetectionFilter;
