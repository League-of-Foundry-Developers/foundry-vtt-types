import type { MaybePromise } from "fvtt-types/utils";

declare global {
  /**
   * The Application responsible for configuring a single Tile document within a parent Scene.
   * @typeParam Options - the type of the options object
   */
  class TileConfig<Options extends TileConfig.Options = TileConfig.Options> extends DocumentSheet<
    Options,
    TileDocument.Implementation
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

    /** @internal */
    type _FormData = Pick<TileDocument, "alpha" | "elevation" | "height" | "rotation" | "sort" | "width" | "x" | "y">;

    interface FormData extends _FormData {
      "occlusion.alpha": TileDocument["occlusion"]["alpha"];
      "occlusion.mode": TileDocument["occlusion"]["mode"];
      "restrictions.light": TileDocument["restrictions"]["light"];
      "restrictions.weather": TileDocument["restrictions"]["weather"];
      "texture.src": TileDocument["texture"]["src"];
      "texture.scaleX": TileDocument["texture"]["scaleX"];
      "texture.scaleY": TileDocument["texture"]["scaleY"];
      "texture.tint": TileDocument["texture"]["tint"];
      "video.autoplay": TileDocument["video"]["autoplay"];
      "video.loop": TileDocument["video"]["loop"];
      "video.volume": TileDocument["video"]["volume"];
    }

    interface Options extends DocumentSheet.Options<TileDocument.Implementation> {
      /**
       * Configure a preview version of a tile which is not yet saved
       */
      preview?: boolean;
    }
  }
}
