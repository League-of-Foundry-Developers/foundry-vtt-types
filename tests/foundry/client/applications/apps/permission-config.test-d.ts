import { expectTypeOf } from "vitest";
import type { ConformRecord } from "fvtt-types/utils";

const PermissionConfig = foundry.applications.apps.PermissionConfig;

const permissionConfig = new PermissionConfig();
expectTypeOf(permissionConfig._prepareContext({})).toEqualTypeOf<
  Promise<foundry.applications.apps.PermissionConfig.RenderContext>
>();

expectTypeOf(PermissionConfig.DEFAULT_OPTIONS).toEqualTypeOf<
  Partial<foundry.applications.api.ApplicationV2.Configuration>
>();
expectTypeOf(PermissionConfig.PARTS).toEqualTypeOf<
  ConformRecord<
    foundry.applications.apps.PermissionConfig.Parts,
    foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart
  >
>();
