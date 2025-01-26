import type { NullishProps } from "fvtt-types/utils";

declare global {
  /**
   * A basic PCO which is handling drawings of any shape.
   */
  class PrimaryGraphics extends PrimaryCanvasObjectMixin(PIXI.Graphics) {
    /**
     * @param options - A config object
     */
    constructor(
      options?:
        | PIXI.GraphicsGeometry
        | NullishProps<{
            /** A geometry passed to the graphics. */
            geometry: PIXI.GraphicsGeometry;

            /** The name of the PCO. */
            name: string;

            /** Any object that owns this PCO. */
            object: PlaceableObject;
          }>,
    );

    override _calculateCanvasBounds(): void;

    override updateCanvasTransform(): void;

    override containsCanvasPoint(point: PIXI.IPointData): boolean;
  }

  namespace PrimaryGraphics {
    type AnyConstructor = typeof AnyPrimaryGraphics;
  }
}

declare abstract class AnyPrimaryGraphics extends PrimaryGraphics {
  constructor(arg0: never, ...args: never[]);
}
