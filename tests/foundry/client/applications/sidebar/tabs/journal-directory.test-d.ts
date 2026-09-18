import { expectTypeOf, test } from "vitest";

import ContextMenu = foundry.applications.ux.ContextMenu;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;
import Journal = foundry.documents.collections.Journal;
import JournalDirectory = foundry.applications.sidebar.tabs.JournalDirectory;

declare const directory: JournalDirectory;

test("foundry/client/applications/sidebar/tabs/journal-directory", () => {
  expectTypeOf(directory).toExtend<DocumentDirectory.Any>();

  // Widened from the `"journal"` literal so a subclass can occupy its own sidebar tab.
  expectTypeOf(JournalDirectory.tabName).toBeString();

  // Narrowed from the base's `DirectoryCollectionMixin.AnyMixed`.
  expectTypeOf(directory.collection).toEqualTypeOf<Journal.Implementation>();
  expectTypeOf(directory.documentClass).toEqualTypeOf<JournalEntry.ImplementationClass>();

  expectTypeOf(directory["_getEntryContextOptions"]()).toEqualTypeOf<ContextMenu.Entry<HTMLElement>[]>();
});
