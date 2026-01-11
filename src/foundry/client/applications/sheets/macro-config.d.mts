import type { Identity } from "#utils";
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
 * @remarks TODO: Stub
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
> {}

declare namespace MacroConfig {
  interface Any extends AnyMacroConfig {}
  interface AnyConstructor extends Identity<typeof AnyMacroConfig> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext, DocumentSheetV2.RenderContext<Macro.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration, DocumentSheetV2.Configuration<Macro.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}
}

declare abstract class AnyMacroConfig extends MacroConfig<
  MacroConfig.RenderContext,
  MacroConfig.Configuration,
  MacroConfig.RenderOptions
> {
  constructor(...args: never);
}

export default MacroConfig;
