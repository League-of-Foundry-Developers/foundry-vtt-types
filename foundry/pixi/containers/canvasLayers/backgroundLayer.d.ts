/**
 * A PIXI.Container subclass of CanvasLayer responsible for rendering the scene background image.
 * The singleton instance of this class is accessed through `canvas.background`.
 */
declare class BackgroundLayer extends CanvasLayer {
  constructor();

  /**
   * The background image
   * @defaultValue `null`
   */
  img: PIXI.Sprite | null;

  /**
   * Return the base HTML element which is used to generate the Scene background
   */
  get source(): HTMLElement | null;

  /**
   * Return a Boolean flag for whether the Scene background texture is a Video element
   */
  get isVideo(): boolean;

  /**
   * @override
   * @remarks Returns `false`
   */
  activate(): any;

  /** @override */
  tearDown(): Promise<void>;

  /**
   * Draw the background image.
   * We first load the image texture and store it in the PIXI loader.
   * Once the requested image has been fully loaded we draw it as a PIXI.Sprite
   * @returns Returns the instance of the Background Layer for convenient chaining
   */
  draw(): Promise<this>;

  /**
   * @deprecated since 0.7.2
   * @see {@link createThumbnail}
   */
  static createThumbnail(
    src: string | PIXI.DisplayObject,
    options?: ImageHelper.CompositeOptions
  ): Promise<ImageHelper.ThumbnailReturn>;
}
