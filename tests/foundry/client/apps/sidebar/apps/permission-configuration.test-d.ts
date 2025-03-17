import { expectTypeOf } from "vitest";

const permissionConfig = new PermissionConfig();

expectTypeOf(permissionConfig.object).toEqualTypeOf<undefined>();
expectTypeOf(PermissionConfig.defaultOptions).toEqualTypeOf<FormApplication.Options>();
expectTypeOf(permissionConfig.options).toEqualTypeOf<FormApplication.Options>();
expectTypeOf(permissionConfig.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(permissionConfig.render(true)).toEqualTypeOf<PermissionConfig>();
