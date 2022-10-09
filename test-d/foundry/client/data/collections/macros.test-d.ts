import { expectType } from "tsd";

const macros = new Macros();
expectType<StoredDocument<Macro>>(macros.get("", { strict: true }));
expectType<StoredDocument<Macro>["data"]["_source"][]>(macros.toJSON());
expectType<MacroDirectory | undefined>(macros.directory);
