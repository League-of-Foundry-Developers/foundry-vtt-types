import type { Identity } from "#utils";
import type DocumentDirectory from "../document-directory.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      MacroDirectory: MacroDirectory.Any;
    }
  }
}

/**
 * The World Macro directory listing.
 * @remarks TODO: Stub
 */
declare class MacroDirectory<
  RenderContext extends MacroDirectory.RenderContext = MacroDirectory.RenderContext,
  Configuration extends MacroDirectory.Configuration = MacroDirectory.Configuration,
  RenderOptions extends MacroDirectory.RenderOptions = MacroDirectory.RenderOptions,
> extends DocumentDirectory<Macro.ImplementationClass, RenderContext, Configuration, RenderOptions> {}

declare namespace MacroDirectory {
  interface Any extends AnyMacroDirectory {}
  interface AnyConstructor extends Identity<typeof AnyMacroDirectory> {}

  interface RenderContext extends DocumentDirectory.RenderContext {}
  interface Configuration extends DocumentDirectory.Configuration {}
  interface RenderOptions extends DocumentDirectory.RenderOptions {}
}

declare abstract class AnyMacroDirectory extends MacroDirectory<
  MacroDirectory.RenderContext,
  MacroDirectory.Configuration,
  MacroDirectory.RenderOptions
> {
  constructor(...args: never);
}

export default MacroDirectory;
