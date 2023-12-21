export {};

declare global {
  namespace PIXI {
    export const LegacyGraphics: typeof PIXI.Graphics & {
      nextRoundedRectBehavior: boolean;
    };
  }
}
