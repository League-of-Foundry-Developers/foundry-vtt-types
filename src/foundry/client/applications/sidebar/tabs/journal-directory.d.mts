import type { DeepPartial, Identity } from "#utils";
import type ContextMenu from "../../ux/context-menu.d.mts";
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
 */
declare class JournalDirectory<
  RenderContext extends JournalDirectory.RenderContext = JournalDirectory.RenderContext,
  Configuration extends JournalDirectory.Configuration = JournalDirectory.Configuration,
  RenderOptions extends JournalDirectory.RenderOptions = JournalDirectory.RenderOptions,
> extends DocumentDirectory<JournalEntry.ImplementationClass, RenderContext, Configuration, RenderOptions> {
  // Fake override.
  static override DEFAULT_OPTIONS: JournalDirectory.DefaultOptions;

  /** @defaultValue `"journal"` */
  static override tabName: string;

  // Fake override.
  override get collection(): foundry.documents.collections.Journal.Implementation;

  /**
   * @remarks Adds an entry that pans to the journal entry's note on the viewed scene.
   */
  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];
}

declare namespace JournalDirectory {
  interface Any extends AnyJournalDirectory {}
  interface AnyConstructor extends Identity<typeof AnyJournalDirectory> {}

  interface RenderContext extends DocumentDirectory.RenderContext {}

  interface Configuration<
    JournalDirectory extends JournalDirectory.Any = JournalDirectory.Any,
  > extends DocumentDirectory.Configuration<JournalDirectory> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<JournalDirectory extends JournalDirectory.Any = JournalDirectory.Any> = DeepPartial<
    Configuration<JournalDirectory>
  > &
    object;

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
