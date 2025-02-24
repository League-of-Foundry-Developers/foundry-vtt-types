import { expectTypeOf } from "vitest";

const macroDirectory = new MacroDirectory();

expectTypeOf(MacroDirectory.defaultOptions).toEqualTypeOf<DocumentDirectory.Options>();
expectTypeOf(macroDirectory.options).toEqualTypeOf<DocumentDirectory.Options>();
expectTypeOf(macroDirectory.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(macroDirectory.render(true)).toEqualTypeOf<MacroDirectory>();
