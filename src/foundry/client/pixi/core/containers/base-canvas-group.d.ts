// FOUNDRY_VERSION: 10.291

/**
 * A mixin which decorates any container with base canvas common properties.
 * @param ContainerClass    - The parent Container class being mixed.
 * @returns                 A ContainerClass subclass mixed with BaseCanvasMixin features.
 */
declare function BaseCanvasMixin<TBase extends ConstructorOf<PIXI.Container>>(
  ContainerClass: TBase
): TBase & {
  new (...args: any[]): BaseCanvasMixin;
};

declare class BaseCanvasMixin {
  constructor(...args: any[]);

  /**
   * The name of this canvas group
   */
  static groupName: string;

  /**
   * A mapping of CanvasLayer classes which belong to this group.
   */
  layers: CanvasLayer;

  /**
   * Create CanvasLayer instances which belong to the primary group.
   * @internal
   */
  #createLayers(): Record<string, CanvasLayer>;

  /**
   * Draw the canvas group and all its component layers.
   */
  draw(): Promise<void>;

  /**
   * Remove and destroy all layers from the base canvas.
   */
  tearDown(options?: { preserveChildren: boolean }): Promise<void>;
}
