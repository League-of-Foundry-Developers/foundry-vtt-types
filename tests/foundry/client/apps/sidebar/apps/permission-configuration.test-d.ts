import { expectTypeOf } from "vitest";

const permissionConfig = new PermissionConfig();

expectTypeOf(permissionConfig.object).toEqualTypeOf<undefined>();
expectTypeOf(PermissionConfig.defaultOptions).toEqualTypeOf<FormApplicationOptions>();
expectTypeOf(permissionConfig.options).toEqualTypeOf<FormApplicationOptions>();
expectTypeOf(permissionConfig.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(permissionConfig.render(true)).toEqualTypeOf<PermissionConfig>();
