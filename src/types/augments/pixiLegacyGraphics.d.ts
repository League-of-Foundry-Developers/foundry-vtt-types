declare global {
  namespace PIXI {
    /**
     * @privateRemarks Unclear if this const isn't just pointing back to the freshly declared Graphics class
     * Trying to replicate the handling in head.js
     */
    export const LegacyGraphics: PIXI.Graphics;
    export class Graphics extends PIXI.smooth.SmoothGraphics {}
  }
}

export {};
