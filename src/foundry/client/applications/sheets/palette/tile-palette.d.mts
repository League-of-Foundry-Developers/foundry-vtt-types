import type { AnyMutableObject, DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type TileConfig from "../tile-config.d.mts";
import type PlaceablePaletteMixin from "./placeable-palette-mixin.d.mts";
import type { SchemaField } from "#common/data/fields.d.mts";

import Document = foundry.abstract.Document;

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      TilePalette: TilePalette.Any;
    }
  }
}

/**
 * A dialog that provides bulk operation or default values for newly-created tiles.
 */
declare class TilePalette<
  RenderContext extends TilePalette.RenderContext = TilePalette.RenderContext,
  Configuration extends TilePalette.Configuration = TilePalette.Configuration,
  RenderOptions extends TilePalette.RenderOptions = TilePalette.RenderOptions,
> extends PlaceablePaletteMixin(TileConfig)<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   id: "tile-palette",
   *   initialData: { width: 100, height: 100 }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: PlaceablePaletteMixin.DefaultOptions;

  /**
   * The setting key where default data is saved.
   *
   * @defaultValue `"tilePalette"`
   */
  static SETTING_KEY: string;

  /**
   * The placeable document.
   *
   * @defaultValue `"Tile"`
   */
  static documentName: Document.PlaceableType;

  /** @defaultValue `{}` */
  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  /**
   * @defaultValue
   * ```js
   * {
   *   body: { template: "templates/scene/palette/tile/body.hbs" },
   *   footer: { template: "templates/generic/form-footer.hbs" }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @remarks Special case handling for the tile layer which doesn't typically 'draw' tiles, but instead places them
   * from the tile browser while the select tool is active. Changes made to the palette with the select tool do not
   * usually update draw state, so we retrieve them directly from the form.
   */
  override get createData(): AnyMutableObject;

  /**
   * @remarks Drops the placement and identity fields, along with the texture's `src`, `fit`, and `alphaThreshold` —
   * all of which are chosen per-Tile rather than as a palette default.
   */
  static override get schema(): SchemaField.Any;

  // Fake override.
  override get controlled(): TileDocument.Implementation[];

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _preparePartContext(
    partId: string,
    context: RenderContext,
    options: DeepPartial<HandlebarsApplicationMixin.RenderOptions>,
  ): Promise<RenderContext>;

  #TilePalette: true;
}

declare namespace TilePalette {
  interface Any extends AnyTilePalette {}
  interface AnyConstructor extends Identity<typeof AnyTilePalette> {}

  interface RenderContext extends TileConfig.RenderContext, PlaceablePaletteMixin.RenderContext {
    /** @remarks The application id and the part id, joined by a `-`. */
    partId: string;

    /**
     * @remarks The source elevation, snapped up to the top of the currently viewed level while the Tile is in the
     * foreground.
     */
    elevation: number;

    /** @remarks Whether the elevation places the Tile at or above the top of the currently viewed level. */
    isForeground: boolean;
  }

  interface Configuration extends TileConfig.Configuration, PlaceablePaletteMixin._Configuration {}

  interface RenderOptions extends TileConfig.RenderOptions, PlaceablePaletteMixin._RenderOptions {}
}

declare abstract class AnyTilePalette extends TilePalette<
  TilePalette.RenderContext,
  TilePalette.Configuration,
  TilePalette.RenderOptions
> {
  constructor(...args: never);
}

export default TilePalette;
