export {};

declare global {
  namespace PIXI {
    interface Graphics {
      nextRoundedRectBehavior: boolean;
    }
  }
}
