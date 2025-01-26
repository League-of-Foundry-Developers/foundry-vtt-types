import { expectTypeOf } from "vitest";

const macroDirectory = new MacroDirectory();

expectTypeOf(MacroDirectory.defaultOptions).toEqualTypeOf<DocumentDirectoryOptions>();
expectTypeOf(macroDirectory.options).toEqualTypeOf<DocumentDirectoryOptions>();
expectTypeOf(macroDirectory.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(macroDirectory.render(true)).toEqualTypeOf<MacroDirectory>();
