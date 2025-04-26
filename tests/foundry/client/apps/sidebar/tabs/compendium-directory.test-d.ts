import { expectTypeOf } from "vitest";

const compendiumDirectory = new CompendiumDirectory();

expectTypeOf(CompendiumDirectory.defaultOptions).toEqualTypeOf<DocumentDirectory.Options>();
expectTypeOf(compendiumDirectory.options).toEqualTypeOf<DocumentDirectory.Options>();
expectTypeOf(compendiumDirectory.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(compendiumDirectory.render(true)).toEqualTypeOf<CompendiumDirectory>();

expectTypeOf(compendiumDirectory.activeFilters).toEqualTypeOf<string[]>();
expectTypeOf(compendiumDirectory.collection).toEqualTypeOf<CompendiumPacks>();
