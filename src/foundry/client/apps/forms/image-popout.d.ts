export {};

declare global {
  interface ImagePopoutOptions extends FormApplicationOptions {
    /**
     * Can this image be shared with connected users?
     * @defaultValue `false`
     */
    shareable: boolean;

    /**
     * The UUID of some related {@link Document}.
     * @defaultValue `null`
     */
    uuid: string | null;
  }

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
  class ImagePopout<Options extends ImagePopoutOptions = ImagePopoutOptions> extends FormApplication<Options, string> {
    constructor(src: string, options?: Partial<ImagePopout.Options>);

    /**
     * @defaultValue `null`
     */
    protected _related: foundry.abstract.Document<any, any> | null;

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
    static override get defaultOptions(): ImagePopoutOptions;

    override get title(): string;

    override getData(options?: Partial<Options> | undefined): MaybePromise<object>;

    /**
     * Test whether the title of the image popout should be visible to the user
     */
    isTitleVisible(): boolean;

    /**
     * Provide a reference to the Document referenced by this popout, if one exists
     */
    getRelatedObject(): Promise<foundry.abstract.Document<any, any> | null>;

    protected override _render(
      force?: boolean,
      options?: Application.RenderOptions<Options> | undefined
    ): Promise<void>;

    protected override _getHeaderButtons(): Application.HeaderButton[];

    /**
     * Determine the correct position and dimensions for the displayed image
     * @returns The positioning object which should be used for rendering
     */
    protected static getPosition(
      img: string
    ): Promise<{ width: number; height: number } | { width: number; height: number; top: number; left: number }>;

    /**
     * Determine the Image dimensions given a certain path
     */
    static getImageSize(path: string): Promise<[width: number, height: number]>;

    /**
     * Share the displayed image with other connected Users
     */
    shareImage(): void;

    /**
     * Handle a received request to display an image.
     */
    protected static _handleShareImage({
      image,
      title,
      uuid
    }?: {
      image: string;
      title: string;
      uuid: string;
    }): ImagePopout;

    /**
     * @remarks Not implemented for ImagePopout
     */
    protected override _updateObject(event: Event, formData?: object): never;
  }

  namespace ImagePopout {
    interface Options extends FormApplicationOptions {
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
  }
}
