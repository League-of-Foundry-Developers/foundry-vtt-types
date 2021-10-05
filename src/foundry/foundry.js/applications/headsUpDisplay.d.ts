/**
 * Render the HUD container
 * @typeParam Options - the type of the options object
 */
declare class HeadsUpDisplay<Options extends Application.Options = Application.Options> extends Application<Options> {
  /**
   * Token HUD
   */
  token: TokenHUD;

  /**
   * Tile HUD
   */
  tile: TileHUD;

  /**
   * Drawing HUD
   */
  drawing: DrawingHUD;

  /**
   * Chat Bubbles
   */
  bubbles: ChatBubbles;

  /**
   * @override
   * @defaultValue
   * ```
   * mergeObject(super.defaultOptions, {
   *   id: "hud",
   *   template: "templates/hud/hud.html",
   *   popOut: false,
   * })
   * ```
   */
  static get defaultOptions(): Application.Options;

  /** @override */
  getData(options?: Partial<Options>): {} | { width: number; height: number };

  /** @override */
  protected _render(force?: boolean, options?: Application.RenderOptions<Options>): Promise<void>;

  /**
   * Align the position of the HUD layer to the current position of the canvas
   */
  align(): void;
}
