import { expectTypeOf } from "vitest";

import RollTableDirectory = foundry.applications.sidebar.tabs.RollTableDirectory;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;
import ContextMenu = foundry.applications.ux.ContextMenu;

expectTypeOf(RollTableDirectory.DEFAULT_OPTIONS).toEqualTypeOf<DocumentDirectory.DefaultOptions>();
expectTypeOf(RollTableDirectory.tabName).toEqualTypeOf<string>();

declare class _TestRollTableDirectory extends RollTableDirectory {
  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];
}
