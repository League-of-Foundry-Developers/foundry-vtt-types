import { expectTypeOf } from "vitest";

import ContextMenu = foundry.applications.ux.ContextMenu;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;
import ItemDirectory = foundry.applications.sidebar.tabs.ItemDirectory;
import Items = foundry.documents.collections.Items;

declare const directory: ItemDirectory;

expectTypeOf(directory).toExtend<DocumentDirectory.Any>();

// Widened from the `"items"` literal so a subclass can occupy its own sidebar tab.
expectTypeOf(ItemDirectory.tabName).toBeString();

// Narrowed from the base's `DirectoryCollectionMixin.AnyMixed`.
expectTypeOf(directory.collection).toEqualTypeOf<Items.Implementation>();
expectTypeOf(directory.documentClass).toEqualTypeOf<Item.ImplementationClass>();

expectTypeOf(directory["_getEntryContextOptions"]()).toEqualTypeOf<ContextMenu.Entry<HTMLElement>[]>();
