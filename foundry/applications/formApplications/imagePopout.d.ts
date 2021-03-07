/**
 * An Image Popout Application which features a single image in a lightbox style frame.
 * This popout can also be used as a form, allowing the user to edit an image which is being used.
 * Furthermore, this application allows for sharing the display of an image with other connected players.
 *
 * @example
 * ```typescript
 * // Construct the Application instance
 * const ip = new ImagePopout("path/to/image.jpg", {
 *   title: "My Featured Image",
 *   shareable: true,
 *   entity: game.actors.getName("My Hero")
 * });
 *
 * // Display the image popout
 * ip.render(true);
 *
 * // Share the image with other connected players
 * ip.share();
 * ```
 */
declare class ImagePopout extends FormApplication<ImagePopout.Data, string> {
  constructor(src: string, options?: Partial<ImagePopout.Options>);

  protected _related: Entity | object | null;

  /** @override */
  static get defaultOptions(): ImagePopout.Options;

  /** @override */
  get title(): string;

  /** @override */
  getData(options?: Application.RenderOptions): Promise<ImagePopout.Data>;

  /**
   * Test whether the title of the image popout should be visible to the user
   */
  isTitleVisible(): boolean;

  /**
   * Provide a reference to the Entity referenced by this popout, if one exists
   */
  getRelatedObject(): Promise<Entity | object | null>;

  /** @override */
  protected _render(force?: boolean, options?: Application.RenderOptions): Promise<void>;

  /** @override */
  protected _getHeaderButtons(): Application.HeaderButton[];

  /**
   * Determine the correct position and dimensions for the displayed image
   */
  protected static getPosition(img: string): Application.Position;

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
  }: {
    image: string;
    title: string;
    uuid: string;
  }): ImagePopout;

  /**
   * @override
   * @remarks Not implemented for ImagePopout
   */
  protected _updateObject(event: Event, formData?: object): never;
}

declare namespace ImagePopout {
  interface Options extends FormApplication.Options {
    /**
     *  @defaultValue `''`
     */
    title: string;
    /**
     * @defaultValue `'templates/apps/image-popout.html'`
     */
    template: string;
    /**
     * @defaultValue `['image-popout', 'dark']`
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

  interface Data<T extends string = string> extends FormApplication.Data<T> {
    image: string;
    showTitle: boolean;
  }
}
