import type { DeepPartial, Identity, IntentionalPartial } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
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
   *   position: {width: 480},
   *   form: {
   *     closeOnSubmit: true
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: PlaceableConfig.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   tabs: {template: "templates/generic/tab-navigation.hbs"},
   *   position: {template: "templates/scene/tile/position.hbs"},
   *   appearance: {template: "templates/scene/tile/appearance.hbs"},
   *   overhead: {template: "templates/scene/tile/overhead.hbs"},
   *   footer: {template: "templates/generic/form-footer.hbs"}
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @defaultValue
   * ```js
   * {
   *   sheet: {
   *     tabs: [
   *       {id: "position", icon: "fa-solid fa-location-dot"},
   *       {id: "appearance", icon: "fa-solid fa-image"},
   *       {id: "overhead", icon: "fa-solid fa-house"}
   *     ],
   *     initial: "position",
   *     labelPrefix: "TILE.TABS"
   *   }
   * }
   * ```
   */
  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  override get title(): string;

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

  protected override _previewChanges(changes: DocumentSheetV2.SubmitData<TileDocument.Implementation>): void;
}

declare namespace TileConfig {
  interface Any extends AnyTileConfig {}
  interface AnyConstructor extends Identity<typeof AnyTileConfig> {}

  interface RenderContext
    extends PlaceableConfig.RenderContext<TileDocument.Implementation>, IntentionalPartial<PreparePartContext> {
    tabClasses: string;

    buttons: ApplicationV2.FormFooterButton[];
  }

  /** @remarks Added by {@linkcode TileConfig._preparePartContext | #_preparePartContext} */
  interface PreparePartContext {
    /** @remarks Added for the `appearance` part; whether the Tile's texture source is a video. */
    hasVideo: boolean;

    /** @remarks Only added when the part being rendered is also a tab of the `sheet` group. */
    tab: ApplicationV2.Tab;
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
