import { ConfiguredDocumentClassForName } from "../../../../types/helperTypes";
import type { TileDataConstructorData } from "../../../common/data/data.mjs/tileData";

declare global {
  /**
   * The Application responsible for configuring a single Tile document within a parent Scene.
   * @typeParam Options - the type of the options object
   */
  class TileConfig<Options extends TileConfig.Options = TileConfig.Options> extends DocumentSheet<
    Options,
    InstanceType<ConfiguredDocumentClassForName<"Tile">>
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

    override close(options?: Application.CloseOptions | undefined): Promise<void>;

    override getData(options?: Partial<Options> | undefined): MaybePromise<object>;

    protected override _onChangeInput(event: JQuery.ChangeEvent): void;

    protected override _updateObject(event: Event, formData: TileConfig.FormData): Promise<unknown>;
  }

  namespace TileConfig {
    type FormData = Pick<TileDataConstructorData, "height" | "img" | "rotation" | "width" | "x" | "y">;

    interface Options extends DocumentSheetOptions<TileDocument> {
      /**
       * Configure a preview version of a tile which is not yet saved
       */
      preview?: boolean;
    }
  }
}
