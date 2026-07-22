import { expectTypeOf } from "vitest";

import MacroDirectory = foundry.applications.sidebar.tabs.MacroDirectory;
import DocumentDirectory = foundry.applications.sidebar.DocumentDirectory;

expectTypeOf(MacroDirectory.DEFAULT_OPTIONS).toEqualTypeOf<DocumentDirectory.DefaultOptions>();
expectTypeOf(MacroDirectory.tabName).toEqualTypeOf<string>();
