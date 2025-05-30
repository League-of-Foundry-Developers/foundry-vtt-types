import type { Identity } from "#utils";
import type DocumentDirectory from "../document-directory.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      JournalDirectory: JournalDirectory.Any;
    }
  }
}

/**
 * The World Journal.
 * @remarks TODO: Stub
 */
declare class JournalDirectory<
  RenderContext extends JournalDirectory.RenderContext = JournalDirectory.RenderContext,
  Configuration extends JournalDirectory.Configuration = JournalDirectory.Configuration,
  RenderOptions extends JournalDirectory.RenderOptions = JournalDirectory.RenderOptions,
> extends DocumentDirectory<JournalEntry.ImplementationClass, RenderContext, Configuration, RenderOptions> {}

declare namespace JournalDirectory {
  interface Any extends AnyJournalDirectory {}
  interface AnyConstructor extends Identity<typeof AnyJournalDirectory> {}

  interface RenderContext extends DocumentDirectory.RenderContext {}
  interface Configuration extends DocumentDirectory.Configuration {}
  interface RenderOptions extends DocumentDirectory.RenderOptions {}
}

declare abstract class AnyJournalDirectory extends JournalDirectory<
  JournalDirectory.RenderContext,
  JournalDirectory.Configuration,
  JournalDirectory.RenderOptions
> {
  constructor(...args: never);
}

export default JournalDirectory;
