import { expectTypeOf } from "vitest";

const compendiumDirectory = new CompendiumDirectory();

expectTypeOf(CompendiumDirectory.defaultOptions).toEqualTypeOf<DocumentDirectoryOptions>();
expectTypeOf(compendiumDirectory.options).toEqualTypeOf<DocumentDirectoryOptions>();
expectTypeOf(compendiumDirectory.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(compendiumDirectory.render(true)).toEqualTypeOf<CompendiumDirectory>();

expectTypeOf(compendiumDirectory.activeFilters).toEqualTypeOf<string[]>();
expectTypeOf(compendiumDirectory.collection).toEqualTypeOf<CompendiumPacks>();
