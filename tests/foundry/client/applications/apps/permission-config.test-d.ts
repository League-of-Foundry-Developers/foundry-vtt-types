import { expectTypeOf, test } from "vitest";
import type { ConformRecord } from "fvtt-types/utils";

import PermissionConfig = foundry.applications.apps.PermissionConfig;

test("foundry/client/applications/apps/permission-config", () => {
  const permissionConfig = new PermissionConfig();
  expectTypeOf(permissionConfig._prepareContext({})).toEqualTypeOf<
    Promise<foundry.applications.apps.PermissionConfig.RenderContext>
  >();

  expectTypeOf(PermissionConfig.DEFAULT_OPTIONS).toEqualTypeOf<PermissionConfig.DefaultOptions>();
  expectTypeOf(PermissionConfig.PARTS).toEqualTypeOf<
    ConformRecord<
      foundry.applications.apps.PermissionConfig.Parts,
      foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart
    >
  >();
});
