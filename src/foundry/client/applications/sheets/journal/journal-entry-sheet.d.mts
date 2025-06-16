import type { ValueOf, Identity } from "#utils";
import type DocumentSheetV2 from "../../api/document-sheet.d.mts";
import type HandlebarsApplicationMixin from "../../api/handlebars-application.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      JournalEntrySheet: JournalEntrySheet.Any;
    }
  }
}

/**
 * The Application responsible for displaying and editing a single JournalEntry Document.
 * @remarks TODO: Stub
 */
declare class JournalEntrySheet<
  RenderContext extends JournalEntrySheet.RenderContext = JournalEntrySheet.RenderContext,
  Configuration extends JournalEntrySheet.Configuration = JournalEntrySheet.Configuration,
  RenderOptions extends JournalEntrySheet.RenderOptions = JournalEntrySheet.RenderOptions,
> extends HandlebarsApplicationMixin(DocumentSheetV2)<
  JournalEntry.Implementation,
  RenderContext,
  Configuration,
  RenderOptions
> {
  /**
   * The available view modes for journal entries.
   */
  static VIEW_MODES: {
    SINGLE: 1;
    MULTIPLE: 2;
  };
}

declare namespace JournalEntrySheet {
  interface Any extends AnyJournalEntrySheet {}
  interface AnyConstructor extends Identity<typeof AnyJournalEntrySheet> {}

  interface RenderContext
    extends HandlebarsApplicationMixin.RenderContext,
      DocumentSheetV2.RenderContext<JournalEntry.Implementation> {}

  interface Configuration
    extends HandlebarsApplicationMixin.Configuration,
      DocumentSheetV2.Configuration<JournalEntry.Implementation> {}

  interface RenderOptions extends HandlebarsApplicationMixin.RenderOptions, DocumentSheetV2.RenderOptions {}

  interface CategoryContext {
    /** The category ID. */
    id: string;

    /** The category name. */
    name: string;
  }

  type VIEW_MODES = ValueOf<typeof JournalEntrySheet.VIEW_MODES>;
}

declare abstract class AnyJournalEntrySheet extends JournalEntrySheet<
  JournalEntrySheet.RenderContext,
  JournalEntrySheet.Configuration,
  JournalEntrySheet.RenderOptions
> {
  constructor(...args: never);
}

export default JournalEntrySheet;
