import type { Identity } from "#utils";

/**
 * The neighborhood blending filter for {@linkcode foundry.canvas.rendering.filters.SMAAFilter}.
 */
declare class SMAANeighborhoodBlendingFilter extends PIXI.Filter {
  constructor();
}

declare namespace SMAANeighborhoodBlendingFilter {
  interface Any extends AnySMAANeighborhoodBlendingFilter {}
  interface AnyConstructor extends Identity<typeof AnySMAANeighborhoodBlendingFilter> {}
}

export default SMAANeighborhoodBlendingFilter;

declare abstract class AnySMAANeighborhoodBlendingFilter extends SMAANeighborhoodBlendingFilter {
  constructor(...args: never);
}
