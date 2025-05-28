/**
 * The neighborhood blending filter for {@linkcode foundry.canvas.SMAAFilter}.
 */
declare class SMAANeighborhoodBlendingFilter extends PIXI.Filter {
  constructor();
}

declare namespace SMAANeighborhoodBlendingFilter {
  interface Any extends AnySMAANeighborhoodBlendingFilter {}
  type AnyConstructor = typeof AnySMAANeighborhoodBlendingFilter;
}

declare abstract class AnySMAANeighborhoodBlendingFilter extends SMAANeighborhoodBlendingFilter {
  constructor(...args: never);
}

export default SMAANeighborhoodBlendingFilter;
