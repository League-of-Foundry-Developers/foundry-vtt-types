import type { AnyObject, DeepPartial, Identity } from "#utils";
import type { fields } from "#client/data/_module.d.mts";
import type ApplicationV2 from "../../api/application.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";
import type TileConfig from "../tile-config.d.mts";
import type PlaceablePaletteMixin from "./placeable-palette-mixin.d.mts";

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
  static override DEFAULT_OPTIONS: TilePalette.DefaultOptions;

  /** @defaultValue `"tilePalette"` */
  static override SETTING_KEY: string;

  /** @defaultValue `"Tile"` */
  static override documentName: string;

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

  get createData(): AnyObject;

  static override get schema(): fields.SchemaField.Any;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  #TilePalette: true;
}

declare namespace TilePalette {
  interface Any extends AnyTilePalette {}
  interface AnyConstructor extends Identity<typeof AnyTilePalette> {}

  // Note(LukeAbby): The mixin's optional `document` is omitted because {@linkcode TileConfig.Configuration}
  // declares it as required with a narrower type, which is what the runtime intersection resolves to.
  interface Configuration extends TileConfig.Configuration, Omit<PlaceablePaletteMixin.Configuration, "document"> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions = DeepPartial<Configuration> &
    object & {
      /**
       * @deprecated Setting `document` in `TilePalette.DEFAULT_OPTIONS` is not supported. If you
       * have a need for this, please file an issue.
       */
      document?: never;
    };

  interface RenderOptions extends TileConfig.RenderOptions, PlaceablePaletteMixin.RenderOptions {}

  // Note(LukeAbby): The config's optional `buttons` is omitted because
  // {@linkcode PlaceablePaletteMixin.RenderContext} declares it as required, which is what the runtime
  // intersection resolves to.
  interface RenderContext extends Omit<TileConfig.RenderContext, "buttons">, PlaceablePaletteMixin.RenderContext {
    /** @remarks Added by {@linkcode TilePalette._prepareContext | #_prepareContext} */
    elevation: number;

    /** @remarks Added by {@linkcode TilePalette._prepareContext | #_prepareContext} */
    isForeground: boolean;
  }
}

declare abstract class AnyTilePalette extends TilePalette<
  TilePalette.RenderContext,
  TilePalette.Configuration,
  TilePalette.RenderOptions
> {
  constructor(...args: never);
}

export default TilePalette;
