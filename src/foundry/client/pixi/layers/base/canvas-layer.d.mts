export {};

declare global {
  /**
   * An abstract pattern for primary layers of the game canvas to implement
   */
  abstract class CanvasLayer<
    DrawOptions extends CanvasLayer.DrawOptions = CanvasLayer.DrawOptions,
    TearDownOptions extends CanvasLayer.TearDownOptions = CanvasLayer.TearDownOptions,
  > extends PIXI.Container {
    constructor();

    /**
     * Options for this layer instance.
     * @defaultValue `this.constructor.layerOptions`
     */
    options: CanvasLayer.LayerOptions;

    /**
     * @defaultValue `false`
     */
    interactiveChildren: boolean;

    /**
     * Customize behaviors of this CanvasLayer by modifying some behaviors at a class level.
     */
    static get layerOptions(): CanvasLayer.LayerOptions;

    /**
     * Return a reference to the active instance of this canvas layer
     */
    static get instance(): CanvasLayer | PIXI.Container | undefined;

    /**
     * The canonical name of the CanvasLayer is the name of the constructor that is the immediate child of the defined baseClass for the layer type.
     * @remarks Foundry defines this as a getter, but since CanvasLayer extends PIXI.Container, it has to be a property.
     */
    readonly name: string;

    /**
     * The name used by hooks to construct their hook string.
     * Note: You should override this getter if hookName should not return the class constructor name.
     */
    get hookName(): string;

    /**
     * Draw the canvas layer, rendering its internal components and returning a Promise
     * The Promise resolves to the drawn layer once its contents are successfully rendered.
     * @param options - Options which configure how the layer is drawn
     */
    draw(options?: DrawOptions): Promise<this>;

    /**
     * The inner _draw method which must be defined by each CanvasLayer subclass.
     * @param options - Options which configure how the layer is drawn
     */
    protected abstract _draw(options?: DrawOptions): Promise<void>;

    /**
     * Deconstruct data used in the current layer in preparation to re-draw the canvas
     * @param options - Options which configure how the layer is deconstructed
     * @remarks ControlsLayer returns void. See https://gitlab.com/foundrynet/foundryvtt/-/issues/6939
     */
    tearDown(options?: TearDownOptions): Promise<this | void>;

    /**
     * The inner _tearDown method which may be customized by each CanvasLayer subclass.
     * @param options - Options which configure how the layer is deconstructed
     */
    protected _tearDown(options?: TearDownOptions): Promise<void>;
  }

  namespace CanvasLayer {
    type AnyConstructor = typeof AnyCanvasLayer;

    interface LayerOptions {
      /**
       * The layer name by which the instance is referenced within the Canvas
       */
      name: string;

      baseClass: typeof CanvasLayer;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface DrawOptions {}

    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface TearDownOptions {}
  }
}

declare abstract class AnyCanvasLayer extends CanvasLayer {
  constructor(arg0: never, ...args: never[]);
}
