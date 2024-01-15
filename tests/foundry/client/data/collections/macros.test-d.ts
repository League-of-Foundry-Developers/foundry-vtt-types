import { expectTypeOf } from "vitest";
import type { StoredDocument } from "../../../../../src/types/utils.d.mts";

const macros = new Macros();
expectTypeOf(macros.get("", { strict: true })).toEqualTypeOf<StoredDocument<Macro>>();
expectTypeOf(macros.toJSON()).toEqualTypeOf<StoredDocument<Macro>["data"]["_source"][]>();
expectTypeOf(macros.directory).toEqualTypeOf<MacroDirectory | undefined>();
