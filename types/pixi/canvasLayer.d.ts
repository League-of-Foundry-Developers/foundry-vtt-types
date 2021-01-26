/**
 * An abstract pattern for primary layers of the game canvas to implement
 * (extends: `PIXI.Container`)
 */
declare class CanvasLayer extends PIXI.Container {
  /**
   * Track whether the canvas layer is currently active for interaction
   * @defaultValue `false`
   */
  _active: boolean;

  /**
   * @defaultValue `false`
   */
  interactive: boolean;

  /**
   * @defaultValue `false`
   */
  interactiveChildren: boolean;

  /**
   * The canonical name of the CanvasLayer
   * @remarks Foundry defines this as a getter, but since CanvasLayer extends
   *          PIXI.Container, it has to be a property.
   */
  name: string;

  constructor();

  /**
   * Return a reference to the active instance of this canvas layer
   */
  static get instance(): CanvasLayer;

  /**
   * Customize behaviors of this CanvasLayer by modifying some behaviors at a
   * class level.
   */
  static get layerOptions(): CanvasLayer.LayerOptions;

  /**
   * Activate the CanvasLayer, deactivating other layers and marking this
   * layer's children as interactive.
   * @returns The layer instance, now activated
   */
  activate(): this;

  /**
   * Deactivate the CanvasLayer, removing interactivity from its children.
   * @returns The layer instance, now inactive
   */
  deactivate(): void;

  /**
   * Draw the canvas layer, rendering its internal components and returning a
   * Promise
   * The Promise resolves to the drawn layer once its contents are successfully
   * rendered.
   */
  draw(): Promise<this | PlaceableObject[]>;

  /**
   * Deconstruct data used in the current layer in preparation to re-draw the
   * canvas
   */
  tearDown(): void;
}

declare namespace CanvasLayer {
  interface LayerOptions {
    /**
     * Should this layer be sorted to the top when it is active?
     */
    sortActiveTop: boolean;

    /**
     * The zIndex sorting of this layer relative to other layers
     */
    zIndex: number;
  }
}
