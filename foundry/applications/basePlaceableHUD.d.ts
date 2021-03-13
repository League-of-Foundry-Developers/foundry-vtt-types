/**
 * An abstract base class for displaying a heads-up-display interface bound to a Placeable Object on the canvas
 */
declare abstract class BasePlaceableHUD<P extends PlaceableObject<PlaceableObject.Data>> extends Application {
  constructor(...args: ConstructorParameters<typeof Application>);

  /**
   * Reference a PlaceableObject this HUD is currently bound to
   * @defaultValue `null`
   */
  object: P | null;

  /**
   * @override
   * @defaultValue
   * ```
   * mergeObject(super.defaultOptions, {
   *   classes: ["placeable-hud"],
   *   popOut: false
   * })
   * ```
   */
  static get defaultOptions(): Application.Options;

  /**
   * Convenience access for the canvas layer which this HUD modifies
   */
  get layer(): P['layer'];

  /**
   * Bind the HUD to a new PlaceableObject and display it
   * @param object - A PlaceableObject instance to which the HUD should be bound
   */
  bind(object: P): void;

  /**
   * Clear the HUD by fading out it's active HTML and recording the new display state
   */
  clear(): void;

  /** @override */
  _render(...args: Parameters<Application['_render']>): Promise<void>;

  /**
   * @override
   * @defaultValue
   * ```
   * mergeObject(this.object.data, {
   *   id: this.id,
   *   classes: this.options.classes.join(' '),
   *   appId: this.appId,
   *   isGM: game.user.isGM,
   *   icons: CONFIG.controlIcons
   * });
   * ```
   */
  getData(
    options?: Application.RenderOptions
  ): Duplicated<P['data']> & {
    id: Application['id'];
    classes: string;
    appId: Application['appId'];
    isGM: boolean;
    icons: typeof CONFIG['controlIcons'];
  };

  /**
   * @override
   * @remarks Returns `void`
   */
  setPosition({ left, top, width, height, scale }?: Partial<Application.Position>): any;

  /** @override */
  activateListeners(html: JQuery<HTMLElement>): void;

  /**
   * Toggle the visible state of all controlled objects in the Layer
   * @param event - The originating click event
   */
  protected _onToggleVisibility(event: JQuery.ClickEvent): Promise<void>;

  /**
   * Toggle locked state of all controlled objects in the Layer
   * @param event - The originating click event
   */
  protected _onToggleLocked(event: JQuery.ClickEvent): Promise<void>;

  /**
   * Handle sorting the z-order of the object
   */
  protected _onSort(up: boolean, event: JQuery.ClickEvent): Promise<void>;
}
