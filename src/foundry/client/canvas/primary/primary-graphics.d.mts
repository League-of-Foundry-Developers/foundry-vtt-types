import type { Identity, InexactPartial } from "#utils";
import type { PrimaryCanvasObjectMixin } from "./_module.d.mts";
import type { PlaceableObject } from "#client/canvas/placeables/_module.d.mts";

/**
 * A basic PCO which is handling drawings of any shape.
 */
declare class PrimaryGraphics extends PrimaryCanvasObjectMixin(PIXI.smooth.SmoothGraphics) {
  /**
   * @param options - A config object
   * @remarks Passing a {@linkcode PIXI.smooth.SmoothGraphicsGeometry} instead of an `options` should be supported here,
   * but has been disabled due to a core bug: {@link https://github.com/foundryvtt/foundryvtt/issues/13170}
   *
   * If you need to pass a specific geometry instead of using a default `new SmoothGraphicsGeometry`, pass it as `options.geometry`.
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
     * @privateRemarks Foundry types this incorrectly because they didn't update it when they switched base classes:
     * {@link https://github.com/foundryvtt/foundryvtt/issues/13170}
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
