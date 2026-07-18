import type { DeepPartial, Identity } from "#utils";
import type ApplicationV2 from "../api/application.d.mts";
import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      MacroConfig: MacroConfig.Any;
    }
  }
}

/**
 * A Macro configuration sheet
 */
declare class MacroConfig<
  RenderContext extends MacroConfig.RenderContext = MacroConfig.RenderContext,
  Configuration extends MacroConfig.Configuration = MacroConfig.Configuration,
  RenderOptions extends MacroConfig.RenderOptions = MacroConfig.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Macro.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  /**
   * @defaultValue
   * ```js
   * {
   *   classes: ["macro-config"],
   *   canCreate: true,
   *   window: {
   *     contentClasses: ["standard-form"],
   *     icon: "fa-solid fa-code",
   *     resizable: true
   *   },
   *   position: {
   *     width: 720,
   *     height: 600
   *   },
   *   actions: { execute: MacroConfig.#onExecute },
   *   form: { closeOnSubmit: true }
   * }
   * ```
   */
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(options: DeepPartial<RenderOptions>): Promise<RenderContext>;

  /**
   * Allow execution even if the document is locked.
   */
  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    submitData: object,
    options?: unknown,
  ): Promise<foundry.applications.api.DocumentSheetV2.SubmitResult<Macro.Implementation>>;

  /**
   * @privateRemarks Prevents duck typing
   */
  #MacroConfig: true;
}

declare namespace MacroConfig {
  interface Any extends AnyMacroConfig {}
  interface AnyConstructor extends Identity<typeof AnyMacroConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Macro.Implementation> {
    typeChoices: Record<CONST.MACRO_TYPES, string>;
    editorLang: "javascript" | "html";
    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Macro.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {
    /**
     * The macro's assigned hotbar slot, if this render is the result of creating this Macro from the hotbar.
     */
    hotbarSlot?: number | undefined;
  }
}

declare abstract class AnyMacroConfig extends MacroConfig<
  MacroConfig.RenderContext,
  MacroConfig.Configuration,
  MacroConfig.RenderOptions
> {
  constructor(...args: never);
}

export default MacroConfig;
