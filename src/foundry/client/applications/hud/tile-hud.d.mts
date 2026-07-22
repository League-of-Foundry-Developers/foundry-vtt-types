import type BasePlaceableHUD from "./placeable-hud.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type { DeepPartial, Identity } from "#utils";
import type { Tile } from "#client/canvas/placeables/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      TileHUD: TileHUD.Any;
    }
  }
}

/**
 * An implementation of the PlaceableHUD base class which renders a heads-up-display interface for Tile objects.
 * The TileHUD implementation can be configured and replaced via {@link CONFIG.Tile.hudClass}.
 */
declare class TileHUD<
  RenderContext extends TileHUD.RenderContext = TileHUD.RenderContext,
  Configuration extends TileHUD.Configuration = TileHUD.Configuration,
  RenderOptions extends TileHUD.RenderOptions = TileHUD.RenderOptions,
> extends HandlebarsApplicationMixin(BasePlaceableHUD)<
  Tile.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "tile-hud",
   *   actions: {
   *     video: TileHUD.#onControlVideo
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: BasePlaceableHUD.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   hud: {
   *     root: true,
   *     template: "templates/hud/tile-hud.hbs"
   *   }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;

  static #TileHUD: true;
}

declare namespace TileHUD {
  interface Any extends AnyTileHUD {}
  interface AnyConstructor extends Identity<typeof AnyTileHUD> {}

  interface RenderContext extends HandlebarsApplicationMixin.RenderContext, BasePlaceableHUD.RenderContext {
    isVideo: boolean;
    videoIcon: string;
    videoTitle: string;
  }
  interface Configuration extends HandlebarsApplicationMixin.Configuration, BasePlaceableHUD.Configuration {}
  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, BasePlaceableHUD.RenderOptions {}
}

declare abstract class AnyTileHUD extends TileHUD<TileHUD.RenderContext, TileHUD.Configuration, TileHUD.RenderOptions> {
  constructor(...args: never);
}

export default TileHUD;
