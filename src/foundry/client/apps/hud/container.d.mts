import type { MaybePromise } from "#utils";

declare global {
  /**
   * Render the HUD container
   * @template Options - the type of the options object
   */
  class HeadsUpDisplay<Options extends Application.Options = Application.Options> extends Application<Options> {
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
     * @defaultValue
     * ```
     * mergeObject(super.defaultOptions, {
     *   id: "hud",
     *   template: "templates/hud/hud.html",
     *   popOut: false,
     * })
     * ```
     */
    static override get defaultOptions(): Application.Options;

    override getData(options?: Partial<Options>): MaybePromise<object>;

    protected override _render(force?: boolean, options?: Application.RenderOptions<Options>): Promise<void>;

    /**
     * Align the position of the HUD layer to the current position of the canvas
     */
    align(): void;
  }

  namespace HeadsUpDisplay {
    interface Any extends HeadsUpDisplay<any> {}
  }
}
