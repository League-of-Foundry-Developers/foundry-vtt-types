import { expectTypeOf } from "vitest";

const rollTableDirectory = new RollTableDirectory();

expectTypeOf(RollTableDirectory.defaultOptions).toEqualTypeOf<DocumentDirectory.Options>();
expectTypeOf(rollTableDirectory.options).toEqualTypeOf<DocumentDirectory.Options>();
expectTypeOf(rollTableDirectory.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(rollTableDirectory.render(true)).toEqualTypeOf<RollTableDirectory>();
