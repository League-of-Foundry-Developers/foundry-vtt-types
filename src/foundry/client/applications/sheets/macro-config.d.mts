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
  static override DEFAULT_OPTIONS: DocumentSheetV2.DefaultOptions;

  static override PARTS: Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>;

  protected override _prepareContext(
    options: DeepPartial<RenderOptions> & { isFirstRender: boolean },
  ): Promise<RenderContext>;

  /**
   * Allow execution even if the document is locked.
   */
  protected override _onRender(context: DeepPartial<RenderContext>, options: DeepPartial<RenderOptions>): Promise<void>;

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;

  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    submitData: DocumentSheetV2.SubmitData<Macro.Implementation>,
    options?: DocumentSheetV2.ProcessSubmitOptions<Macro.Implementation>,
  ): Promise<DocumentSheetV2.SubmitResult<Macro.Implementation>>;

  #MacroConfig: true;
}

declare namespace MacroConfig {
  interface Any extends AnyMacroConfig {}
  interface AnyConstructor extends Identity<typeof AnyMacroConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Macro.Implementation> {
    /** @remarks Values are unlocalized `"TYPES.Macro.{type}"` keys. */
    typeChoices: Record<CONST.MACRO_TYPES, string>;

    editorLang: "javascript" | "html";

    buttons: ApplicationV2.FormFooterButton[];
  }

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Macro.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {
    /**
     * The hotbar slot the Macro should be assigned to once it is created.
     * @remarks Only read on the first render, and only used when the Macro is being created.
     */
    hotbarSlot: number | undefined;
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
