import { expectTypeOf } from "vitest";

import CardsDirectory = foundry.applications.sidebar.tabs.CardsDirectory;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;
import ContextMenu = foundry.applications.ux.ContextMenu;

expectTypeOf(CardsDirectory.DEFAULT_OPTIONS).toEqualTypeOf<DocumentDirectory.DefaultOptions>();
expectTypeOf(CardsDirectory.tabName).toEqualTypeOf<string>();

declare class _TestCardsDirectory extends CardsDirectory {
  protected override _getEntryContextOptions(): ContextMenu.Entry<HTMLElement>[];
}
