import { expectTypeOf } from "vitest";
import Document = foundry.abstract.Document;

const macros = new Macros([]);
expectTypeOf(macros.get("", { strict: true })).toEqualTypeOf<Macro.Stored>();
expectTypeOf(macros.toJSON()).toEqualTypeOf<Macro.Stored["_source"][]>();
expectTypeOf(macros.directory).toEqualTypeOf<MacroDirectory>();
