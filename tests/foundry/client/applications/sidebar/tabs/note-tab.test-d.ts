import { expectTypeOf } from "vitest";

import NoteTab = foundry.applications.sidebar.tabs.NoteTab;
import PlaceableTab = foundry.applications.sidebar.tabs.PlaceableTab;

declare const directory: foundry.applications.sidebar.tabs.PlaceableDirectory;

const tab = new NoteTab({ collectionName: "notes", directory });

expectTypeOf(NoteTab.ENTRY_PARTIAL).toBeString();
expectTypeOf(tab.collectionName).toBeString();

// Only prepared for GM users, so this stays optional.
declare const entry: NoteTab.EntryContext;
expectTypeOf(entry.isVisible).toEqualTypeOf<boolean | undefined>();
expectTypeOf(entry.label).toBeString();

declare const context: NoteTab.RenderContext;
expectTypeOf(context.entries).toEqualTypeOf<NoteTab.EntryContext[] | undefined>();

class CustomNoteTab extends NoteTab {
  protected override _getEntryLabel(entry: PlaceableTab.PlaceableDocument): string {
    return super._getEntryLabel(entry);
  }

  protected override async _prepareEntry(
    entry: PlaceableTab.PlaceableDocument,
    context: PlaceableTab._EntryContext,
  ): Promise<NoteTab.EntryContext> {
    return super._prepareEntry(entry, context);
  }
}

expectTypeOf(new CustomNoteTab({ collectionName: "notes", directory })).toEqualTypeOf<CustomNoteTab>();
