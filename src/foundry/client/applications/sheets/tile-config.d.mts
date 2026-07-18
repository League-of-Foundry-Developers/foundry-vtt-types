import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type PlaceableConfig from "./placeable-config.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      TileConfig: TileConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single Tile document within a parent Scene.
 */
declare class TileConfig<
  RenderContext extends TileConfig.RenderContext = TileConfig.RenderContext,
  Configuration extends TileConfig.Configuration = TileConfig.Configuration,
  RenderOptions extends TileConfig.RenderOptions = TileConfig.RenderOptions,
> extends PlaceableConfig<TileDocument.Implementation, RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["tile-config"],
   *   canCreate: true,
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-cubes"
   *   },
   *   position: { width: 480 },
   *   form: {
   *     closeOnSubmit: true
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: PlaceableConfig.DefaultOptions<TileDocument.Implementation>;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @defaultValue
   * ```js
   * {
   *   sheet: {
   *     tabs: [
   *       { id: "position", icon: "fa-solid fa-location-dot" },
   *       { id: "appearance", icon: "fa-solid fa-image" },
   *       { id: "overhead", icon: "fa-solid fa-house" }
   *     ],
   *     initial: "position",
   *     labelPrefix: "TILE.TABS"
   *   }
   * }
   * ```
   */
  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  get title(): string;

  protected override _configureRenderOptions(options: DeepPartial<RenderOptions>): void;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  protected override _preparePartContext(
    partId: string,
    context: ApplicationV2.RenderContextOf<this>,
    options: DeepPartial<RenderOptions>,
  ): Promise<ApplicationV2.RenderContextOf<this>>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  protected override _previewChanges(changes: foundry.documents.BaseTile.UpdateData): void;
}

declare namespace TileConfig {
  interface Any extends AnyTileConfig {}
  interface AnyConstructor extends Identity<typeof AnyTileConfig> {}

  interface RenderContext extends PlaceableConfig.RenderContext<TileDocument.Implementation> {
    tabClasses: string;
    buttons: ApplicationV2.FormFooterButton[];
    tab?: ApplicationV2.Tab | undefined;
    hasVideo?: boolean | undefined;
  }

  interface Configuration extends PlaceableConfig.Configuration<TileDocument.Implementation> {}

  interface RenderOptions extends PlaceableConfig.RenderOptions {}
}

declare abstract class AnyTileConfig extends TileConfig<
  TileConfig.RenderContext,
  TileConfig.Configuration,
  TileConfig.RenderOptions
> {
  constructor(...args: never);
}

export default TileConfig;
