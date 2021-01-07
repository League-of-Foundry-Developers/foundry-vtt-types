// @TODO:

/**
 * Render the HUD container
 */
declare class HeadsUpDisplay extends Application {
  /** Chat Bubbles */
  bubbles: ChatBubbles

  /** Drawing HUD */
  drawing: DrawingHUD

  /** Tile HUD */
  tile: TileHUD

  /** Token HUD */
  token: TokenHUD

  constructor (...args: any[])

  align (): void
}
