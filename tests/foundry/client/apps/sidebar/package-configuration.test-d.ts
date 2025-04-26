import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

declare const packageConfiguration: PackageConfiguration;

expectTypeOf(packageConfiguration.object).toEqualTypeOf<FormApplication.NoObject>();
expectTypeOf(PackageConfiguration.defaultOptions).toEqualTypeOf<PackageConfiguration.Options>();
expectTypeOf(packageConfiguration.options).toEqualTypeOf<PackageConfiguration.Options>();
expectTypeOf(packageConfiguration.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(packageConfiguration.render(true)).toEqualTypeOf<PackageConfiguration>();

expectTypeOf(PackageConfiguration.categoryOrder).toEqualTypeOf<string[]>();
expectTypeOf(packageConfiguration.activeCategory).toEqualTypeOf<string>();
