import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";
import type PlaceableConfig from "./placeable-config.d.mts";
import type { AdaptiveLightingShader } from "#client/canvas/rendering/shaders/_module.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      AmbientLightConfig: AmbientLightConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single AmbientLight document within a parent Scene.
 */
declare class AmbientLightConfig<
  RenderContext extends AmbientLightConfig.RenderContext = AmbientLightConfig.RenderContext,
  Configuration extends AmbientLightConfig.Configuration = AmbientLightConfig.Configuration,
  RenderOptions extends AmbientLightConfig.RenderOptions = AmbientLightConfig.RenderOptions,
> extends PlaceableConfig<AmbientLightDocument.Implementation, RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["ambient-light-config"],
   *   window: {
   *     contentClasses: ["standard-form"]
   *   },
   *   position: {width: 560},
   *   form: {
   *     closeOnSubmit: true
   *   },
   *   actions: {
   *     reset: this.#onReset
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: PlaceableConfig.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   tabs: {
   *     template: "templates/generic/tab-navigation.hbs"
   *   },
   *   basic: {
   *     template: "templates/scene/parts/light-basic.hbs"
   *   },
   *   animation: {
   *     template: "templates/scene/parts/light-animation.hbs"
   *   },
   *   advanced: {
   *     template: "templates/scene/parts/light-advanced.hbs"
   *   },
   *   footer: {
   *     template: "templates/generic/form-footer.hbs"
   *   }
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
   *       {id: "basic", icon: "fa-solid fa-lightbulb"},
   *       {id: "animation", icon: "fa-solid fa-play"},
   *       {id: "advanced", icon: "fa-solid fa-gears"}
   *     ],
   *     initial: "basic",
   *     labelPrefix: "AMBIENT_LIGHT.TABS"
   *   }
   * }
   * ```
   */
  static override TABS: Record<string, ApplicationV2.TabsConfiguration>;

  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  override changeTab(tab: string, group: string, options?: ApplicationV2.ChangeTabOptions): void;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  protected override _previewChanges(changes: DocumentSheetV2.SubmitData<AmbientLightDocument.Implementation>): void;

  /**
   * @deprecated since v14, until v16
   * @remarks "The AmbientLightConfig#preview has been deprecated in favor of AmbientLightConfig#_preview"
   */
  get preview(): AmbientLightDocument.Implementation | null;
}

declare namespace AmbientLightConfig {
  interface Any extends AnyAmbientLightConfig {}
  interface AnyConstructor extends Identity<typeof AnyAmbientLightConfig> {}

  interface RenderContext extends PlaceableConfig.RenderContext<AmbientLightDocument.Implementation> {
    tabClasses: string;

    /**
     * @remarks The preview document, the same value as {@linkcode PlaceableConfig.RenderContext.model | context.model}.
     */
    light: AmbientLightDocument.Implementation;

    colorationTechniques: typeof AdaptiveLightingShader.SHADER_TECHNIQUES;

    /**
     * @remarks Whether the previewed light is a darkness source, i.e. its `config.negative` is set.
     */
    isDarkness: boolean;

    /**
     * @remarks {@linkcode CONFIG.Canvas.darknessAnimations} when {@linkcode RenderContext.isDarkness | isDarkness},
     * otherwise {@linkcode CONFIG.Canvas.lightAnimations}.
     */
    lightAnimations: typeof CONFIG.Canvas.lightAnimations | typeof CONFIG.Canvas.darknessAnimations;

    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration extends PlaceableConfig.Configuration<AmbientLightDocument.Implementation> {}

  interface RenderOptions extends PlaceableConfig.RenderOptions {}
}

declare abstract class AnyAmbientLightConfig extends AmbientLightConfig<
  AmbientLightConfig.RenderContext,
  AmbientLightConfig.Configuration,
  AmbientLightConfig.RenderOptions
> {
  constructor(...args: never);
}

export default AmbientLightConfig;
