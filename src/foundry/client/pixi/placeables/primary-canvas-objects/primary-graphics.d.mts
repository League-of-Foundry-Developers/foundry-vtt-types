import type { Identity, NullishProps } from "#utils";

declare global {
  /**
   * A basic PCO which is handling drawings of any shape.
   */
  class PrimaryGraphics extends PrimaryCanvasObjectMixin(PIXI.Graphics) {
    /**
     * @param options - A config object
     */
    constructor(
      /**
       * @remarks Passing `null`, or an object where the `geometry` property is either missing or nullish, will result in an effective default of `new PIXI.GraphicsGeometry()`
       */
      options?: PIXI.GraphicsGeometry | PrimaryGraphics.ConstructorOptions | null,
    );

    override _calculateCanvasBounds(): void;

    override updateCanvasTransform(): void;

    override containsCanvasPoint(point: PIXI.IPointData): boolean;
  }

  namespace PrimaryGraphics {
    interface Any extends AnyPrimaryGraphics {}
    interface AnyConstructor extends Identity<typeof AnyPrimaryGraphics> {}

    /** @internal */
    type _ConstructorOptions = NullishProps<{
      /**
       * A geometry passed to the graphics.
       * @defaultValue `new PIXI.GraphicsGeometry()`
       * @remarks Default via calling `super(geometry)` with a falsey value
       */
      geometry: PIXI.GraphicsGeometry;

      /**
       * The name of the PCO.
       * @defaultValue `null`
       * @remarks Default via `?? null` in function body
       */
      name: string;

      /**
       * Any object that owns this PCO.
       * @defaultValue `null`
       * @remarks Default via `?? null` in function body
       * @privateRemarks Foundry types as `*`, but the only place they use this class is for `Drawing`s
       */
      object: PlaceableObject.Any;
    }>;

    interface ConstructorOptions extends _ConstructorOptions {}
  }
}

declare abstract class AnyPrimaryGraphics extends PrimaryGraphics {
  constructor(...args: never);
}
