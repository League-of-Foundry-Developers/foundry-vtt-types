import type { Identity, InexactPartial } from "#utils";
import type { PrimaryCanvasObjectMixin } from "./_module.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";

/**
 * A basic PCO which is handling drawings of any shape.
 */
declare class PrimaryGraphics extends PrimaryCanvasObjectMixin(PIXI.smooth.SmoothGraphics) {
  /**
   * @param options - A config object
   * @remarks Passing a geometry object should still be supported here; Foundry swapped this class from extending {@linkcode PIXI.Graphics}
   * to {@linkcode PIXI.smooth.SmoothGraphics}, changing the geometry type used from {@linkcode PIXI.GraphicsGeometry} to
   * {@linkcode PIXI.smooth.SmoothGraphicsGeometry}, but they neglected to update the `instanceof` check in the constructor, which still
   * wants a `GraphicsGeometry` if anything is passed other than {@linkcode PrimaryGraphics.ConstructorOptions | ConstructorOptions}.
   * Since this would cause the type of {@linkcode PrimaryGraphics.geometry | PrimaryGraphics#geometry} to be wrong, it is disallowed.
   */
  constructor(options?: PrimaryGraphics.ConstructorOptions);

  protected override _calculateCanvasBounds(): void;

  override updateCanvasTransform(): void;

  override containsCanvasPoint(point: PIXI.IPointData): boolean;

  #PrimaryGraphics: true;
}

declare namespace PrimaryGraphics {
  interface Any extends AnyPrimaryGraphics {}
  interface AnyConstructor extends Identity<typeof AnyPrimaryGraphics> {}

  /** @internal */
  type _ConstructorOptions = InexactPartial<{
    /**
     * A geometry passed to the graphics.
     * @defaultValue {@linkcode PIXI.smooth.SmoothGraphicsGeometry | new PIXI.smooth.SmoothGraphicsGeometry()}
     * @remarks Default applied in the {@linkcode PIXI.smooth.SmoothGraphics} constructor.
     *
     * Foundry types this as {@linkcode PIXI.GraphicsGeometry} still, despite swapping from extending {@linkcode PIXI.Graphics}
     * to `SmoothGraphics` in v13. Both classes extend {@linkcode PIXI.Geometry}, but `SmoothGraphicsGeometry` does not extend
     * `GraphicsGeometry`. Likely an oversight, rather than intentional wrongness.
     */
    geometry: PIXI.smooth.SmoothGraphicsGeometry;

    /**
     * The name of the PCO.
     * @defaultValue `null`
     */
    name: string | null;

    /**
     * Any object that owns this PCO.
     * @defaultValue `null`
     * @remarks Foundry types as `*`, but the only place this class sees core use it's in {@linkcode PrimaryCanvasGroup.addDrawing | PrimaryCanvasGroup#addDrawing}
     *
     * See {@linkcode PrimaryCanvasObjectMixin.AnyMixed.object | PrimaryCanvasObject#object}
     */
    object: PlaceableObject.Any | null;
  }>;

  interface ConstructorOptions extends _ConstructorOptions {}
}

export default PrimaryGraphics;

declare abstract class AnyPrimaryGraphics extends PrimaryGraphics {
  constructor(...args: never);
}
