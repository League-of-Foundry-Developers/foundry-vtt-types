import type DocumentSheetV2 from "../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../api/handlebars-application.d.mts";

/**
 * A Macro configuration sheet
 * @remarks TODO: Stub
 */
declare class MacroConfig<
  RenderContext extends MacroConfig.RenderContext = MacroConfig.RenderContext,
  Configuration extends MacroConfig.Configuration = MacroConfig.Configuration,
  RenderOptions extends DocumentSheetV2.RenderOptions = DocumentSheetV2.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  Macro.ConfiguredInstance,
  RenderContext,
  Configuration,
  RenderOptions
> {}

declare namespace MacroConfig {
  interface RenderContext extends DocumentSheetV2.RenderContext<Macro.ConfiguredInstance> {}

  interface Configuration extends DocumentSheetV2.Configuration<Macro.ConfiguredInstance> {}
}

export default MacroConfig;
