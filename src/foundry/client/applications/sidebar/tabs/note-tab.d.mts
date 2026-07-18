import type { Identity } from "#utils";
import type PlaceableTab from "./placeable-tab.d.mts";

declare module "#configuration" {
  namespace Hooks {
    interface ApplicationV2Config {
      NoteTab: NoteTab.Any;
    }
  }
}

/**
 * The Note-specific placeables tab.
 */
declare class NoteTab extends PlaceableTab<"notes"> {
  constructor(options: PlaceableTab.InputOptions<NoteTab.Configuration>);

  /** @defaultValue `"templates/sidebar/tabs/placeable/note.hbs"` */
  static override ENTRY_PARTIAL: string;

  protected override _getEntryLabel(entry: NoteDocument.Implementation): string;

  protected override _prepareEntry(
    entry: NoteDocument.Implementation,
    context: PlaceableTab.PartialEntryContext,
  ): Promise<NoteTab.EntryContext>;

  #NoteTab: true;
}

declare namespace NoteTab {
  interface Any extends AnyNoteTab {}
  interface AnyConstructor extends Identity<typeof AnyNoteTab> {}

  interface Configuration extends PlaceableTab.Configuration<"notes"> {}

  interface EntryContext extends PlaceableTab.EntryContext {
    /**
     * @remarks Added by {@linkcode NoteTab._prepareEntry | #_prepareEntry}, only for a GM user.
     */
    isVisible?: boolean | undefined;
  }

  interface RenderContext extends PlaceableTab.RenderContext {}
}

declare abstract class AnyNoteTab extends NoteTab {
  constructor(...args: never);
}

export default NoteTab;
