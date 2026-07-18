import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      LevelConfig: LevelConfig.Any;
    }
  }
}

/**
 * The Application responsible for configuring a single Level document.
 */
declare class LevelConfig<
  RenderContext extends object = LevelConfig.RenderContext,
  Configuration extends LevelConfig.Configuration = LevelConfig.Configuration,
  RenderOptions extends LevelConfig.RenderOptions = LevelConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Level.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["level-config"],
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-layer-group"
   *   },
   *   position: { width: 560 },
   *   form: { closeOnSubmit: true }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  /**
   * @defaultValue
   * ```js
   * {
   *   body: { template: "templates/scene/level/body.hbs", scrollable: [""] },
   *   footer: { template: "templates/generic/form-footer.hbs" }
   * }
   * ```
   */
  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;

  protected override _prepareSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    formData: foundry.applications.ux.FormDataExtended,
    updateData?: unknown,
  ): foundry.documents.BaseLevel.UpdateData;

  /**
   * @privateRemarks Prevents duck typing
   */
  #LevelConfig: true;
}

declare namespace LevelConfig {
  interface Any extends AnyLevelConfig {}
  interface AnyConstructor extends Identity<typeof AnyLevelConfig> {}

  interface OtherLevelChoice {
    label: string;
    value: string;
  }

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Level.Implementation> {
    /** @remarks Added by {@linkcode LevelConfig._prepareContext | #_prepareContext} */
    gridUnits?: string | undefined;

    /** @remarks Added by {@linkcode LevelConfig._prepareContext | #_prepareContext} */
    buttons?: ApplicationV2.FormFooterButton[] | undefined;

    /** @remarks Added by {@linkcode LevelConfig._prepareContext | #_prepareContext} */
    otherLevels?: OtherLevelChoice[] | undefined;

    /** @remarks Added by {@linkcode LevelConfig._prepareContext | #_prepareContext} */
    textureFitModes?: Record<CONST.TEXTURE_DATA_FIT_MODES, string> | undefined;
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Level.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyLevelConfig extends LevelConfig<
  object,
  LevelConfig.Configuration,
  LevelConfig.RenderOptions
> {
  constructor(...args: never);
}

export default LevelConfig;
