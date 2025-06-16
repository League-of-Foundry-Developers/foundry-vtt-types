import { expectTypeOf } from "vitest";
import { Macros } from "#client/documents/collections/_module.mjs";

import MacroDirectory = foundry.applications.sidebar.tabs.MacroDirectory;

const macros = new Macros([]);
expectTypeOf(macros.get("", { strict: true })).toEqualTypeOf<Macro.Stored>();
expectTypeOf(macros.toJSON()).toEqualTypeOf<Macro.Stored["_source"][]>();
expectTypeOf(macros.directory).toEqualTypeOf<MacroDirectory>();
expectTypeOf(macros.contents).toEqualTypeOf<Macro.Stored[]>();
