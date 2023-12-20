import { expectTypeOf } from "vitest";

const macros = new Macros();
expectTypeOf(macros.get("", { strict: true })).toEqualTypeOf<StoredDocument<Macro>>();
expectTypeOf(macros.toJSON()).toEqualTypeOf<StoredDocument<Macro>["data"]["_source"][]>();
expectTypeOf(macros.directory).toEqualTypeOf<MacroDirectory | undefined>();
