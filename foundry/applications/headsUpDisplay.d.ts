/**
 * Render the HUD container
 */
declare class HeadsUpDisplay extends Application {
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

  /**
   * Chat Bubbles
   */
  bubbles: ChatBubbles;

  /**
   * Drawing HUD
   */
  drawing: DrawingHUD;

  /**
   * Tile HUD
   */
  tile: TileHUD;

  /**
   * Token HUD
   */
  token: TokenHUD;

  align(): void;

  getData(): {} | { width: number; height: number };

  protected _render(...args: Parameters<Application['_render']>): Promise<void>;
}
