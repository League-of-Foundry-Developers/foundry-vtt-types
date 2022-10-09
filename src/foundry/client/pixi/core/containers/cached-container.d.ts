/**
 * A special type of PIXI.Container which draws its contents to a cached RenderTexture.
 * This is accomplished by overriding the Container#render method to draw to our own special RenderTexture.
 */
declare class CachedContainer extends PIXI.Container {
  constructor();

  /**
   * The RenderTexture that is the render destination for the contents of this Container
   */
  readonly renderTexture: PIXI.RenderTexture;

  protected _onResize: () => void;

  /**
   * An object which stores a reference to the normal renderer target and source frame.
   * We track this so we can restore them after rendering our cached texture.
   */
  protected _backup: {
    renderTexture: PIXI.RenderTexture | undefined;
    sourceFrame: PIXI.Rectangle;
  };

  /**
   * An RGBA array used to define the clear color of the RenderTexture
   * @defaultValue `[0, 0, 0, 1]`
   */
  clearColor: [r: number, g: number, b: number, a: number];

  /**
   * Should our Container also be displayed on screen, in addition to being drawn to the cached RenderTexture?
   * @defaultValue `false`
   */
  displayed: boolean;

  /**
   * A bound Sprite which uses this container's render texture
   */
  get sprite(): PIXI.Sprite;

  /** @internal */
  protected _sprite: PIXI.Sprite | undefined;

  destroy(options?: Parameters<PIXI.Container["destroy"]>[0]): ReturnType<PIXI.Container["destroy"]>;

  render(renderer: Parameters<PIXI.Container["render"]>[0]): void;

  /**
   * Bind our cached RenderTexture to the Renderer, replacing the original target.
   * @param renderer - The active canvas renderer
   */
  protected _bind(renderer: PIXI.Renderer): void;

  /**
   * Remove our cached RenderTexture from the Renderer, re-binding the original target.
   * @param renderer - The active canvas renderer
   */
  protected _unbind(renderer: PIXI.Renderer): void;

  /**
   * Resize the cached RenderTexture when the dimensions or resolution of the Renderer have changed.
   */
  protected _resize(renderer: PIXI.Renderer): void;
}
