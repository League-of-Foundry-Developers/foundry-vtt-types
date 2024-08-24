import type { MaybePromise } from "../../../../types/utils.d.mts";

declare global {
  /**
   * The Application responsible for configuring a single Tile document within a parent Scene.
   * @typeParam Options - the type of the options object
   */
  class TileConfig<Options extends TileConfig.Options = TileConfig.Options> extends DocumentSheet<
    Options,
    TileDocument.ConfiguredInstance
  > {
    /**
     * @defaultValue
     * ```typescript
     * mergeObject(super.defaultOptions, {
     *   id: "tile-config",
     *   title: game.i18n.localize("TILE.ConfigTitle"),
     *   template: "templates/scene/tile-config.html",
     *   width: 420,
     *   height: "auto",
     *   submitOnChange: true,
     *   tabs: [{navSelector: ".tabs", contentSelector: "form", initial: "basic"}]
     * });
     * ```
     */
    static override get defaultOptions(): TileConfig.Options;

    override close(options?: Application.CloseOptions): Promise<void>;

    override getData(options?: Partial<Options>): MaybePromise<object>; // TODO: Implement GetDataReturnType

    protected override _onChangeInput(event: JQuery.ChangeEvent): Promise<void>;

    protected override _updateObject(event: Event, formData: TileConfig.FormData): Promise<unknown>;
  }

  namespace TileConfig {
    type Any = TileConfig<any>;

    type FormData = Pick<TileDocument, "alpha" | "height" | "rotation" | "width" | "x" | "y" | "overhead" | "roof"> & {
      "texture.src": string | null;
      "texture.scaleX": number | null;
      "texture.scaleY": number | null;
      "texture.tint": string;
    };

    interface Options extends DocumentSheetOptions<TileDocument> {
      /**
       * Configure a preview version of a tile which is not yet saved
       */
      preview?: boolean;
    }
  }
}
