/**
 * An abstract pattern for primary layers of the game canvas to implement
 */
declare abstract class CanvasLayer extends PIXI.Container {
  constructor();

  /**
   * Track whether the canvas layer is currently active for interaction
   * @defaultValue `false`
   */
  protected _active: boolean;

  /**
   * @defaultValue `false`
   */
  interactive: boolean;

  /**
   * @defaultValue `false`
   */
  interactiveChildren: boolean;

  /* -------------------------------------------- */
  /*  Properties and Attributes
  /* -------------------------------------------- */

  /**
   * Customize behaviors of this CanvasLayer by modifying some behaviors at a class level.
   */
  static get layerOptions(): CanvasLayer.LayerOptions;

  /* -------------------------------------------- */

  /**
   * Return a reference to the active instance of this canvas layer
   */
  static get instance(): CanvasLayer;

  /* -------------------------------------------- */

  /**
   * The canonical name of the CanvasLayer
   * @remarks Foundry defines this as a getter, but since CanvasLayer extends PIXI.Container, it has to be a property.
   */
  name: string;

  /* -------------------------------------------- */
  /*  Rendering
  /* -------------------------------------------- */

  /**
   * Deconstruct data used in the current layer in preparation to re-draw the canvas
   */
  tearDown(): void;

  /* -------------------------------------------- */

  /**
   * Draw the canvas layer, rendering its internal components and returning a Promise
   * The Promise resolves to the drawn layer once its contents are successfully rendered.
   */
  draw(): Promise<this | PlaceableObject[]> | this;

  /* -------------------------------------------- */
  /*  Methods
  /* -------------------------------------------- */

  /**
   * Activate the CanvasLayer, deactivating other layers and marking this layer's children as interactive.
   * @returns The layer instance, now activated
   */
  activate(): this;

  /* -------------------------------------------- */

  /**
   * Deactivate the CanvasLayer, removing interactivity from its children.
   * @returns The layer instance, now inactive
   */
  deactivate(): void;
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
