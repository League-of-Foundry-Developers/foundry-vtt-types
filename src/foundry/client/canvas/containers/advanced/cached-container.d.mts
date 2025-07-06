import type { Identity, InexactPartial } from "#utils";
import { SpriteMesh } from "#client/canvas/containers/_module.mjs";

/**
 * A special type of {@linkcode PIXI.Container} which draws its contents to a cached {@linkcode PIXI.RenderTexture | RenderTexture}.
 * This is accomplished by overriding the {@linkcode PIXI.Container.render | Container#render} method to draw to our own special `RenderTexture`.
 */
declare class CachedContainer extends PIXI.Container {
  /**
   * Construct a CachedContainer.
   * @param sprite - A specific sprite to bind to this `CachedContainer` and its renderTexture.
   */
  constructor(sprite?: PIXI.Sprite | SpriteMesh);

  /**
   * The texture configuration to use for this cached container
   * @abstract
   */
  static textureConfiguration: CachedContainer.TextureConfiguration;

  /**
   * A map of render textures, linked to their render function and an optional RGBA clear color.
   */
  protected _renderPaths: Map<PIXI.RenderTexture, CachedContainer.RenderOptions>;

  /**
   * An RGBA array used to define the clear color of the RenderTexture
   * @defaultValue `[0, 0, 0, 1]`
   */
  clearColor: Color.RGBAColorVector;

  /**
   * Should our Container also be displayed on screen, in addition to being drawn to the cached RenderTexture?
   * @defaultValue `false`
   */
  displayed: boolean;

  /**
   * If true, the Container is rendered every frame.
   * If false, the Container is rendered only if {@linkcode CachedContainer.renderDirty | CachedContainer#renderDirty} is true.
   * @defaultValue `true`
   */
  autoRender: boolean;

  /**
   * Does the Container need to be rendered?
   * Set to false after the Container is rendered.
   * @defaultValue `true`
   */
  renderDirty: boolean;

  /**
   * The primary render texture bound to this cached container.
   */
  get renderTexture(): PIXI.RenderTexture;

  /**
   * Set the alpha mode of the cached container render texture.
   */
  set alphaMode(mode: PIXI.ALPHA_MODES);

  /** @remarks Foundry provides no getter, this is for accurate typing only, as without it Typescript would infer the type as `PIXI.ALPHA_MODES` */
  get alphaMode(): undefined;

  /**
   * A bound Sprite which uses this container's render texture
   */
  get sprite(): PIXI.Sprite | SpriteMesh | undefined;

  set sprite(sprite: PIXI.Sprite | SpriteMesh);

  /**
   * Create a render texture, provide a render method and an optional clear color.
   * @param options - Optional parameters.
   * @returns A reference to the created render texture.
   */
  createRenderTexture(options?: CachedContainer.RenderOptions): PIXI.RenderTexture;

  /**
   * Remove a previously created render texture.
   * @param renderTexture - The render texture to remove.
   * @param destroy - Should the render texture be destroyed? (default: `true`)
   */
  removeRenderTexture(renderTexture: PIXI.RenderTexture, destroy?: boolean): void;

  /**
   * Clear the cached container, removing its current contents.
   * @param destroy - Tell children that we should destroy texture as well. (default: `true`)
   * @returns A reference to the cleared container for chaining.
   * @remarks Added possibility of void return due to child classes
   */
  clear(destroy?: boolean): this;

  override destroy(options?: PIXI.IDestroyOptions | boolean): void;

  override render(renderer: PIXI.Renderer): void;

  /**
   * Resize a render texture passed as a parameter with the renderer.
   * @param renderer - The active canvas renderer.
   * @param rt       - The render texture to resize.
   */
  static resizeRenderTexture(renderer: PIXI.Renderer, rt: PIXI.RenderTexture): void;

  #CachedContainer: true;
}

declare namespace CachedContainer {
  interface Any extends AnyCachedContainer {}
  interface AnyConstructor extends Identity<typeof AnyCachedContainer> {}

  /** @internal */
  type _TextureConfiguration = InexactPartial<{
    multisample: PIXI.MSAA_QUALITY;
    scaleMode: PIXI.SCALE_MODES;
    format: PIXI.FORMATS;
    mipmap: PIXI.MIPMAP_MODES;
  }>;

  interface TextureConfiguration extends _TextureConfiguration {}

  /** @internal */
  type _RenderOptions = InexactPartial<{
    /** Render function that will be called to render into the RT. */
    renderFunction: (renderer: PIXI.Renderer) => void;

    /** An optional clear color to clear the RT before rendering into it. */
    clearColor: Color.RGBAColorVector;
  }>;

  interface RenderOptions extends _RenderOptions {}
}

export default CachedContainer;

declare abstract class AnyCachedContainer extends CachedContainer {
  constructor(...args: never);
}
