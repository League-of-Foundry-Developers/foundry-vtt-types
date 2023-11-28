declare global {
  namespace PIXI {
    export const LegacyGraphics: typeof PIXI.Graphics;
    export const Graphics: typeof PIXI.smooth.SmoothGraphics;
  }
}

export {};
