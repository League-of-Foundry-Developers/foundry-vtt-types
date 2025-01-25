import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

const toursManagement = new ToursManagement();

expectTypeOf(toursManagement.object).toEqualTypeOf<undefined>();
expectTypeOf(ToursManagement.defaultOptions).toEqualTypeOf<PackageConfiguration.Options>();
expectTypeOf(toursManagement.options).toEqualTypeOf<PackageConfiguration.Options>();
expectTypeOf(toursManagement.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(toursManagement.render(true)).toEqualTypeOf<ToursManagement>();
