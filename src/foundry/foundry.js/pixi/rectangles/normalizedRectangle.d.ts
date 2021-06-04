/**
 * A PIXI.Rectangle where the width and height are always positive and the x and y are always the top-left
 */
declare class NormalizedRectangle extends PIXI.Rectangle {
  constructor(x: number, y: number, width: number, height: number);
}
