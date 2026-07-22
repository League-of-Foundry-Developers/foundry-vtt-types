import { expectTypeOf } from "vitest";

import JournalDirectory = foundry.applications.sidebar.tabs.JournalDirectory;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;
import ContextMenu = foundry.applications.ux.ContextMenu;

expectTypeOf(JournalDirectory.DEFAULT_OPTIONS).toEqualTypeOf<DocumentDirectory.DefaultOptions>();
expectTypeOf(JournalDirectory.tabName).toEqualTypeOf<string>();

declare class _TestJournalDirectory extends JournalDirectory {
  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];
}
