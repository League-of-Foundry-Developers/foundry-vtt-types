import { expectTypeOf } from "vitest";

import ItemDirectory = foundry.applications.sidebar.tabs.ItemDirectory;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;
import ContextMenu = foundry.applications.ux.ContextMenu;

expectTypeOf(ItemDirectory.DEFAULT_OPTIONS).toEqualTypeOf<DocumentDirectory.DefaultOptions>();
expectTypeOf(ItemDirectory.tabName).toEqualTypeOf<string>();

declare class _TestItemDirectory extends ItemDirectory {
  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];
}
