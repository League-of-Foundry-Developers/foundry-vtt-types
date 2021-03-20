/**
 * Render the HUD container
 */
declare class HeadsUpDisplay extends Application {
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
   * Define default options which configure the HUD
   * @defaultValue
   * ```
   * mergeObject(super.defaultOptions, {
   *   id: "hud",
   *   template: "templates/hud/hud.html",
   *   popOut: false,
   * })
   * ```
   */
  static get defaultOptions(): typeof Application['defaultOptions'];

  getData(): {} | { width: number; height: number };

  _render(...args: Parameters<Application['_render']>): Promise<void>;

  align(): void;
}
