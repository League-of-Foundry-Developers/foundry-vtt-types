/**
 * The neighborhood blending filter for {@link foundry.canvas.SMAAFilter | `foundry.canvas.SMAAFilter`}.
 */
declare class SMAANeighborhoodBlendingFilter extends PIXI.Filter {
  constructor();
}

declare namespace SMAANeighborhoodBlendingFilter {
  interface Any extends AnySMAANeighborhoodBlendingFilter {}
  type AnyConstructor = typeof AnySMAANeighborhoodBlendingFilter;
}

declare abstract class AnySMAANeighborhoodBlendingFilter extends SMAANeighborhoodBlendingFilter {
  constructor(arg0: never, ...args: never[]);
}

export default SMAANeighborhoodBlendingFilter;
