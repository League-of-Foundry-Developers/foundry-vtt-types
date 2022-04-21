/**
 * An abstract pattern for primary layers of the game canvas to implement
 * @typeParam Options - The type of the options in this layer.
 */
declare abstract class CanvasLayer<Options extends CanvasLayerOptions = CanvasLayerOptions> extends PIXI.Container {
  constructor();

  /**
   * Options for this layer instance.
   * @defaultValue `this.constructor.layerOptions`
   */
  options: Options;

  /**
   * @defaultValue `false`
   */
  interactive: boolean;

  /**
   * @defaultValue `false`
   */
  interactiveChildren: boolean;

  /**
   * Track whether the canvas layer is currently active for interaction
   * @defaultValue `false`
   * @remarks This is public because it's checked from outside in foundry and modules sometimes need to do the same.
   */
  _active: boolean;

  /**
   * Customize behaviors of this CanvasLayer by modifying some behaviors at a class level.
   */
  static get layerOptions(): CanvasLayerOptions;

  /**
   * Return a reference to the active instance of this canvas layer
   */
  static get instance(): CanvasLayer | undefined;

  /**
   * The canonical name of the CanvasLayer
   * @remarks Foundry defines this as a getter, but since CanvasLayer extends PIXI.Container, it has to be a property.
   */
  readonly name: string;

  /**
   * Draw the canvas layer, rendering its internal components and returning a Promise
   * The Promise resolves to the drawn layer once its contents are successfully rendered.
   * @remarks It returns Promise<this> but is overridden by a subclass in this way.
   */
  draw(): Promise<this | undefined> | this;

  /**
   * Deconstruct data used in the current layer in preparation to re-draw the canvas
   * @remarks ControlsLayer returns void. See https://gitlab.com/foundrynet/foundryvtt/-/issues/6939
   */
  tearDown(): Promise<this | void>;

  /**
   * Activate the CanvasLayer, deactivating other layers and marking this layer's children as interactive.
   * @returns The layer instance, now activated
   */
  activate(): this;

  /**
   * Deactivate the CanvasLayer, removing interactivity from its children.
   * @returns The layer instance, now inactive
   * @remarks It returns Promise<this> but is overridden by a subclass returning void.
   */
  deactivate(): this | void;

  /**
   * Get the zIndex that should be used for ordering this layer vertically relative to others in the same Container.
   */
  getZIndex(): number;
}

/**
 * Options which configure the behavior of a Canvas Layer.
 */
declare interface CanvasLayerOptions {
  /**
   * The layer name by which the instance is referenced within the Canvas
   */
  name: string;

  /**
   * The zIndex sorting of this layer relative to other layers
   */
  zIndex: number;

  /**
   * Should this layer be sorted to the top when it is active?
   */
  sortActiveTop: boolean;
}

declare namespace CanvasLayer {
  /**
   * Options which configure the behavior of a Canvas Layer.
   * @remarks This type exists for consistency
   */
  type LayerOptions = CanvasLayerOptions;
}
