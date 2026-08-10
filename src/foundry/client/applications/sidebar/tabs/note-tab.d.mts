import type { DeepPartial, Identity } from "#utils";
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
declare class NoteTab<
  RenderContext extends NoteTab.RenderContext = NoteTab.RenderContext,
  Configuration extends NoteTab.Configuration = NoteTab.Configuration,
  RenderOptions extends NoteTab.RenderOptions = NoteTab.RenderOptions,
> extends PlaceableTab<RenderContext, Configuration, RenderOptions> {
  /**
   * @defaultValue `"templates/sidebar/tabs/placeable/note.hbs"`
   */
  static override ENTRY_PARTIAL: string;

  /**
   * @remarks Falls back to the linked page or entry's name before the note's ID.
   */
  protected override _getEntryLabel(entry: PlaceableTab.PlaceableDocument): string;

  protected override _prepareEntry(
    entry: PlaceableTab.PlaceableDocument,
    context: PlaceableTab._EntryContext,
  ): Promise<NoteTab.EntryContext>;

  #NoteTab: true;
}

declare namespace NoteTab {
  interface Any extends AnyNoteTab {}
  interface AnyConstructor extends Identity<typeof AnyNoteTab> {}

  interface EntryContext extends PlaceableTab.EntryContext {
    /**
     * Whether any non-GM user can see the note's journal entry.
     *
     * @remarks Only prepared for GM users; a note with no linked journal reports whether its author is a player.
     */
    isVisible?: boolean | undefined;
  }

  interface RenderContext extends PlaceableTab.RenderContext {
    entries?: EntryContext[] | undefined;
  }

  interface Configuration<NoteTab extends NoteTab.Any = NoteTab.Any> extends PlaceableTab.Configuration<NoteTab> {}

  // Note(LukeAbby): This `& object` is so that the `DEFAULT_OPTIONS` can be overridden more easily
  // Without it then `static override DEFAULT_OPTIONS = { unrelatedProp: 123 }` would error.
  type DefaultOptions<NoteTab extends NoteTab.Any = NoteTab.Any> = DeepPartial<
    Omit<Configuration<NoteTab>, "collectionName" | "directory">
  > &
    object;

  interface RenderOptions extends PlaceableTab.RenderOptions {}
}

declare abstract class AnyNoteTab extends NoteTab<NoteTab.RenderContext, NoteTab.Configuration, NoteTab.RenderOptions> {
  constructor(...args: never);
}

export default NoteTab;
