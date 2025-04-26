import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

const moduleManagement = new ModuleManagement({});

expectTypeOf(moduleManagement.object).toEqualTypeOf<FormApplication.NoObject>();
expectTypeOf(ModuleManagement.defaultOptions).toEqualTypeOf<FormApplication.Options>();
expectTypeOf(moduleManagement.options).toEqualTypeOf<FormApplication.Options>();
expectTypeOf(moduleManagement.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(moduleManagement.render(true)).toEqualTypeOf<ModuleManagement>();

expectTypeOf(moduleManagement.isEditable).toEqualTypeOf<boolean>();
