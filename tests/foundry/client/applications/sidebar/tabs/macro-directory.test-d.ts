import { expectTypeOf } from "vitest";

import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;
import MacroDirectory = foundry.applications.sidebar.tabs.MacroDirectory;
import Macros = foundry.documents.collections.Macros;

declare const directory: MacroDirectory;

expectTypeOf(directory).toExtend<DocumentDirectory.Any>();

// Widened from the `"macros"` literal so a subclass can occupy its own sidebar tab.
expectTypeOf(MacroDirectory.tabName).toBeString();

// Narrowed from the base's `DirectoryCollectionMixin.AnyMixed`.
expectTypeOf(directory.collection).toEqualTypeOf<Macros.Implementation>();
expectTypeOf(directory.documentClass).toEqualTypeOf<Macro.ImplementationClass>();
