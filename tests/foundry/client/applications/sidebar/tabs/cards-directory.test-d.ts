import { expectTypeOf } from "vitest";

import CardStacks = foundry.documents.collections.CardStacks;
import CardsDirectory = foundry.applications.sidebar.tabs.CardsDirectory;
import ContextMenu = foundry.applications.ux.ContextMenu;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;

declare const directory: CardsDirectory;

expectTypeOf(directory).toExtend<DocumentDirectory.Any>();

// Widened from the `"cards"` literal so a subclass can occupy its own sidebar tab.
expectTypeOf(CardsDirectory.tabName).toBeString();

// Narrowed from the base's `DirectoryCollectionMixin.AnyMixed`.
expectTypeOf(directory.collection).toEqualTypeOf<CardStacks.Implementation>();
expectTypeOf(directory.documentClass).toEqualTypeOf<Cards.ImplementationClass>();

expectTypeOf(directory["_getEntryContextOptions"]()).toEqualTypeOf<ContextMenu.Entry<HTMLElement>[]>();
