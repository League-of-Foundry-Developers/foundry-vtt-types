import { expectTypeOf } from "vitest";

const rollTableDirectory = new RollTableDirectory();

expectTypeOf(RollTableDirectory.defaultOptions).toEqualTypeOf<DocumentDirectoryOptions>();
expectTypeOf(rollTableDirectory.options).toEqualTypeOf<DocumentDirectoryOptions>();
expectTypeOf(rollTableDirectory.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(rollTableDirectory.render(true)).toEqualTypeOf<RollTableDirectory>();
