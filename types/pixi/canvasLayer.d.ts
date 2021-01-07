/**
 * An abstract pattern for primary layers of the game canvas to implement
 */
declare class CanvasLayer extends PIXI.Container {
  name: string

  constructor ();

  activate (): void;

  deactivate (): void;

  /**
   * Draw the canvas layer, rendering its internal components and returning a Promise
   * The Promise resolves to the drawn layer once its contents are successfully rendered.
   */
  draw (): Promise<CanvasLayer>;
}
