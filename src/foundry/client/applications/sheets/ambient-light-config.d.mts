import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
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
   *   position: { width: 560 },
   *   form: {
   *     closeOnSubmit: true
   *   },
   *   actions: {
   *     reset: this.#onReset
   *   }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: PlaceableConfig.DefaultOptions<AmbientLightDocument.Implementation>;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  /**
   * @defaultValue
   * ```js
   * {
   *   sheet: {
   *     tabs: [
   *       { id: "basic", icon: "fa-solid fa-lightbulb" },
   *       { id: "animation", icon: "fa-solid fa-play" },
   *       { id: "advanced", icon: "fa-solid fa-gears" }
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

  protected override _previewChanges(changes: foundry.documents.BaseAmbientLight.UpdateData): void;

  /**
   * @deprecated "The AmbientLightConfig#preview has been deprecated in favor of
   * {@linkcode AmbientLightConfig._preview | AmbientLightConfig#_preview}" (since v14, until v16)
   */
  get preview(): AmbientLightDocument.Implementation | null;

  /**
   * @privateRemarks Prevents duck typing
   */
  #private: true;
}

declare namespace AmbientLightConfig {
  interface Any extends AnyAmbientLightConfig {}
  interface AnyConstructor extends Identity<typeof AnyAmbientLightConfig> {}

  interface RenderContext extends PlaceableConfig.RenderContext<AmbientLightDocument.Implementation> {
    tabClasses: string;
    light: AmbientLightDocument.Implementation;
    colorationTechniques: typeof AdaptiveLightingShader.SHADER_TECHNIQUES;
    isDarkness: boolean;
    lightAnimations: typeof CONFIG.Canvas.darknessAnimations | typeof CONFIG.Canvas.lightAnimations;
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
