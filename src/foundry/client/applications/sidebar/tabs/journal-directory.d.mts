import type ApplicationV2 from "../../api/application.d.mts";
import type DocumentDirectory from "../document-directory.d.mts";

/**
 * The World Journal.
 * @remarks TODO: Stub
 */
declare class JournalDirectory<
  RenderContext extends JournalDirectory.RenderContext = JournalDirectory.RenderContext,
  Configuration extends JournalDirectory.Configuration = JournalDirectory.Configuration,
  RenderOptions extends ApplicationV2.RenderOptions = ApplicationV2.RenderOptions,
> extends DocumentDirectory<JournalEntry.ImplementationClass, RenderContext, Configuration, RenderOptions> {}

declare namespace JournalDirectory {
  interface RenderContext extends DocumentDirectory.RenderContext {}

  interface Configuration extends DocumentDirectory.Configuration {}
}

export default JournalDirectory;
