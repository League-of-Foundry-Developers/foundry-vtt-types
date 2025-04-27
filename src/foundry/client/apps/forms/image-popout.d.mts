import type { MaybePromise } from "fvtt-types/utils";

declare global {
  /** @deprecated {@link ImagePopout.Options | `ImagePopout.Options`} */
  type ImagePopoutOptions = ImagePopout.Options;

  /**
   * An Image Popout Application which features a single image in a lightbox style frame.
   * This popout can also be used as a form, allowing the user to edit an image which is being used.
   * Furthermore, this application allows for sharing the display of an image with other connected players.
   *
   * @typeParam Options - The type of the options object
   *
   * @example
   * ```typescript
   * // Construct the Application instance
   * const ip = new ImagePopout("path/to/image.jpg", {
   *   title: "My Featured Image",
   *   shareable: true,
   *   uuid: game.actors.getName("My Hero").uuid
   * });
   *
   * // Display the image popout
   * ip.render(true);
   *
   * // Share the image with other connected players
   * ip.share();
   * ```
   */
  class ImagePopout<Options extends ImagePopout.Options = ImagePopout.Options> extends FormApplication<
    string,
    Options
  > {
    constructor(src: string, options?: Partial<ImagePopout.Options>);

    /**
     * Whether the application should display video content.
     */
    get isVideo(): boolean;

    /**
     * @defaultValue
     * ```typescript
     * foundry.utils.mergeObject(super.defaultOptions, {
     *   template: "templates/apps/image-popout.html",
     *   classes: ["image-popout", "dark"],
     *   editable: false,
     *   resizable: true,
     *   shareable: false,
     *   uuid: null
     * })
     * ```
     */
    static override get defaultOptions(): ImagePopout.Options;

    override get title(): string;

    override getData(options?: Partial<Options>): MaybePromise<object>;

    /**
     * Test whether the title of the image popout should be visible to the user
     */
    isTitleVisible(): boolean;

    /**
     * Provide a reference to the Document referenced by this popout, if one exists
     */
    getRelatedObject(): Promise<foundry.abstract.Document.Any | null>;

    protected override _render(force?: boolean, options?: Application.RenderOptions<Options>): Promise<void>;

    override activateListeners(html: JQuery<HTMLElement>): void;

    protected override _getHeaderButtons(): Application.HeaderButton[];

    /**
     * Determine the correct position and dimensions for the displayed image
     * @param img - The image URL.
     * @returns The positioning object which should be used for rendering
     */
    protected static getPosition(
      img: string,
    ): Promise<{ width: number; height: number } | { width: number; height: number; top: number; left: number }>;

    /**
     * Determine the Image dimensions given a certain path
     * @param path - The image source.
     */
    static getImageSize(path: string): Promise<[width: number, height: number]>;

    /**
     * Determine the dimensions of the given video file.
     * @param src - The URL to the video.
     */
    static getVideoSize(src: string): Promise<[width: number, height: number]>;

    /**
     * Share the displayed image with other connected Users
     */
    shareImage(options: ImagePopout.ShareImageConfig): void;

    /**
     * Handle a received request to display an image.
     * @param config - The image configuration data.
     */
    protected static _handleShareImage(config: ImagePopout.ShareImageConfig): ImagePopout;

    /**
     * @remarks Not implemented for ImagePopout
     */
    protected override _updateObject(event: Event, formData?: object): never;
  }

  namespace ImagePopout {
    interface Any extends ImagePopout<any> {}

    interface Options extends FormApplication.Options {
      /**
       * @defaultValue `"templates/apps/image-popout.html"`
       */
      template: string;

      /**
       * @defaultValue `["image-popout", "dark"]`
       */
      classes: string[];

      /**
       * @defaultValue `false`
       */
      editable: boolean;

      /**
       * @defaultValue `true`
       */
      resizable: boolean;

      /**
       * @defaultValue `false`
       */
      shareable: boolean;

      /**
       * @defaultValue `null`
       */
      uuid: string | null;
    }

    interface ShareImageConfig {
      /** The image URL to share. */
      image: string;

      /** The image title. */
      title: string;

      /** The UUID of a Document related to the image, used to determine permission to see the image title. */
      uuid?: string;

      /** If this is provided, the permissions of the related Document will be ignored and the title will be shown based on this parameter. */
      showTitle?: boolean;

      /** A list of user IDs to show the image to. */
      users?: string[];
    }

    interface Options extends FormApplication.Options {
      /**
       * Caption text to display below the image.
       * @defaultValue `false`
       */
      caption: boolean;

      /**
       * The UUID of some related {@link Document | `Document`}.
       * @defaultValue `null`
       */
      uuid: string | null;

      /**
       * Force showing or hiding the title.
       */
      showTitle: boolean;
    }
  }
}
