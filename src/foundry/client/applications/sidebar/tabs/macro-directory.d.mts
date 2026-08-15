import type { DeepPartial, Identity } from "#utils";
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
 */
declare class MacroDirectory<
  RenderContext extends MacroDirectory.RenderContext = MacroDirectory.RenderContext,
  Configuration extends MacroDirectory.Configuration = MacroDirectory.Configuration,
  RenderOptions extends MacroDirectory.RenderOptions = MacroDirectory.RenderOptions,
> extends DocumentDirectory<Macro.ImplementationClass, RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: MacroDirectory.DefaultOptions;

  /** @defaultValue `"macros"` */
  static override tabName: string;

  // Fake override.
  override get collection(): foundry.documents.collections.Macros.Implementation;
}

declare namespace MacroDirectory {
  interface Any extends AnyMacroDirectory {}
  interface AnyConstructor extends Identity<typeof AnyMacroDirectory> {}

  interface RenderContext extends DocumentDirectory.RenderContext {}

  interface Configuration<
    MacroDirectory extends MacroDirectory.Any = MacroDirectory.Any,
  > extends DocumentDirectory.Configuration<MacroDirectory> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<MacroDirectory extends MacroDirectory.Any = MacroDirectory.Any> = DeepPartial<
    Configuration<MacroDirectory>
  > &
    object;

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
