import { expectTypeOf } from "vitest";

import NoteTab = foundry.applications.sidebar.tabs.NoteTab;
import PlaceableDirectory = foundry.applications.sidebar.tabs.PlaceableDirectory;
import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;

declare const directory: PlaceableDirectory.Any;

const tab = new NoteTab({ collectionName: "notes", directory });

expectTypeOf(tab).toEqualTypeOf<NoteTab>();
expectTypeOf(NoteTab.ENTRY_PARTIAL).toBeString();

declare class _TestNoteTabSubclass extends NoteTab {
  protected override _getEntryLabel(entry: NoteDocument.Implementation): string;
  protected override _prepareEntry(
    entry: NoteDocument.Implementation,
    context: PlaceableTab.PartialEntryContext,
  ): Promise<NoteTab.EntryContext>;
}
