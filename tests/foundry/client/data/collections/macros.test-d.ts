import { expectTypeOf } from "vitest";
import type Document from "../../../../../src/foundry/common/abstract/document.d.mts";

const macros = new Macros([]);
expectTypeOf(macros.get("", { strict: true })).toEqualTypeOf<Document.Stored<Macro>>();
expectTypeOf(macros.toJSON()).toEqualTypeOf<Document.Stored<Macro>["_source"][]>();
expectTypeOf(macros.directory).toEqualTypeOf<MacroDirectory>();
