import { expectTypeOf } from "vitest";

import ContextMenu = foundry.applications.ux.ContextMenu;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;
import RollTableDirectory = foundry.applications.sidebar.tabs.RollTableDirectory;
import RollTables = foundry.documents.collections.RollTables;

declare const directory: RollTableDirectory;

expectTypeOf(directory).toExtend<DocumentDirectory.Any>();

// Widened from the `"tables"` literal so a subclass can occupy its own sidebar tab.
expectTypeOf(RollTableDirectory.tabName).toBeString();

// Narrowed from the base's `DirectoryCollectionMixin.AnyMixed`.
expectTypeOf(directory.collection).toEqualTypeOf<RollTables.Implementation>();
expectTypeOf(directory.documentClass).toEqualTypeOf<RollTable.ImplementationClass>();

expectTypeOf(directory["_getEntryContextOptions"]()).toEqualTypeOf<ContextMenu.Entry<HTMLElement>[]>();
