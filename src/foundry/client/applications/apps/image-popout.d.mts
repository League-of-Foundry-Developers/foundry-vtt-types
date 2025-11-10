import type { _DeepPartial, DeepPartial, Identity, InexactPartial } from "#utils";
import type { ApplicationV2, HandlebarsApplicationMixin } from "#client/applications/api/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      ImagePopout: ImagePopout.Any;
    }
  }
}

/**
 * An Image Popout Application which features a single image in a lightbox style frame.
 * Furthermore, this application allows for sharing the display of an image with other connected players.
 *
 * @example
 * Creating an Image Popout
 * ```js
 * // Construct the Application instance
 * const ip = new ImagePopout({
 *   src: "path/to/image.jpg",
 *   uuid: game.actors.getName("My Hero").uuid
 *   window: {title: "My Featured Image"}
 * });
 *
 * // Display the image popout
 * ip.render(true);
 *
 * // Share the image with other connected players
 * ip.shareImage();
 * ```
 */
declare class ImagePopout<
  RenderContext extends ImagePopout.RenderContext = ImagePopout.RenderContext,
  Configuration extends ImagePopout.Configuration = ImagePopout.Configuration,
  RenderOptions extends ImagePopout.RenderOptions = ImagePopout.RenderOptions,
> extends HandlebarsApplicationMixin(ApplicationV2)<RenderContext, Configuration, RenderOptions> {
  constructor(options: DeepPartial<Configuration> & { src: string });

  /** @deprecated "An ImagePopout image path must be assigned to options.src." (since v13, until v15) */
  constructor(options: string, _options: DeepPartial<Configuration>);

  // Fake override.
  static override DEFAULT_OPTIONS: ImagePopout.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  override get title(): string;

  /**
   * Whether the application should display video content.
   */
  get isVideo(): boolean;

  /**
   * Share the displayed image with other connected Users
   * @remarks This is callable with no `options`, that will just produce a popup with a broken `img`
   * (no `src` means the alt text is displayed) and no title. Not desirable, but not an error.
   */
  shareImage(options?: ImagePopout.ShareImageOptions): void;

  protected override _initializeApplicationOptions(options: DeepPartial<Configuration>): Configuration;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _preFirstRender(
    context: DeepPartial<RenderContext>,
    options: DeepPartial<RenderOptions>,
  ): Promise<void>;

  /**
   * Handle a received request to display an image.
   * @param config - The image configuration data.
   * @internal
   */
  static _handleShareImage(options?: ImagePopout.ShareImageConfig): ImagePopout.Any;

  #ImagePopout: true;
}

declare namespace ImagePopout {
  interface Any extends AnyImagePopout {}
  interface AnyConstructor extends Identity<typeof AnyImagePopout> {}

  /**
   * @remarks Foundry's override of `_prepareContext` does not call `super`. Therefore it does not
   * inherit context from its parent class.
   */
  interface RenderContext {
    caption: string | undefined;
    image: string;
    isVideo: boolean;
    title: string;
    altText: string;
  }

  interface Configuration<ImagePopout extends ImagePopout.Any = ImagePopout.Any>
    extends HandlebarsApplicationMixin.Configuration,
      ApplicationV2.Configuration<ImagePopout> {
    /** The URL to the image or video file */
    src: string;

    /** Caption text to display below the image. */
    caption: string;

    /**
     * The UUID of some related {@linkcode Document}.
     * @defaultValue `null`
     */
    uuid: string | null | undefined;

    /** Force showing or hiding the title */
    showTitle?: boolean | null | undefined;
  }

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<ImagePopout extends ImagePopout.Any = ImagePopout.Any> = DeepPartial<Configuration<ImagePopout>> &
    object;

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, ApplicationV2.RenderOptions {}

  /** The interface for sending with a `"shareImage"` socket event. */
  interface ShareImageConfig {
    /**
     * The image URL to share.
     */
    image: string;

    /**
     * The image title.
     */
    title: string;

    /**
     * The UUID of a {@linkcode Document} related to the image, used to determine permission to see the image title.
     */
    uuid?: string | undefined;

    /**
     * If this is provided, the permissions of the related Document will be ignored and the title will be shown based on this parameter.
     */
    showTitle?: string | undefined;

    /**
     * A list of user IDs to show the image to.
     */
    users?: string[] | undefined;
  }

  /**
   * Options for {@linkcode ImagePopout.shareImage | ImagePopout#shareImage}.
   */
  interface ShareImageOptions extends InexactPartial<ShareImageConfig> {}
}

declare abstract class AnyImagePopout extends ImagePopout<
  ImagePopout.RenderContext,
  ImagePopout.Configuration,
  ImagePopout.RenderOptions
> {}

export default ImagePopout;
