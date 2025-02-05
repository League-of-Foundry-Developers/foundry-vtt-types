import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

const moduleManagement = new ModuleManagement({});

expectTypeOf(moduleManagement.object).toEqualTypeOf<undefined>();
expectTypeOf(ModuleManagement.defaultOptions).toEqualTypeOf<FormApplicationOptions>();
expectTypeOf(moduleManagement.options).toEqualTypeOf<FormApplicationOptions>();
expectTypeOf(moduleManagement.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(moduleManagement.render(true)).toEqualTypeOf<ModuleManagement>();

expectTypeOf(moduleManagement.isEditable).toEqualTypeOf<boolean>();
