import { expectTypeOf } from "vitest";

const itemDirectory = new ItemDirectory();

expectTypeOf(ItemDirectory.defaultOptions).toEqualTypeOf<DocumentDirectoryOptions>();
expectTypeOf(itemDirectory.options).toEqualTypeOf<DocumentDirectoryOptions>();
expectTypeOf(itemDirectory.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(itemDirectory.render(true)).toEqualTypeOf<ItemDirectory>();
