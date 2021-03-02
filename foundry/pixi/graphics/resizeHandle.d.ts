/**
 * A handle to resize a placeable object
 */
declare class ResizeHandle extends PIXI.Graphics {
  constructor(offset: [number, number]);

  public offset: [number, number];

  /**
   * Refresh the position of this handle based on the given bounds
   * @param bounds - Rectangle of object being resized
   */
  public refresh(bounds: Rectangle): void;

  /**
   * Compute the updated dimensions to match movement of the resize
   *
   * @param current - Current rectangle of the object being resized
   * @param origin - Origin rectangle of the resize
   * @param destination - Destination rectangle of the resize
   * @param options - An optional object of options, currently supports aspectRatio which is a number or null
   * @returns the new dimensions
   */
  public updateDimensions(
    current: Rectangle,
    origin: Rectangle,
    destination: Rectangle,
    { aspectRatio }?: { aspectRatio?: number }
  ): Rectangle;
}
