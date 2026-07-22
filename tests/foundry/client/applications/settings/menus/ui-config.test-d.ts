import { expectTypeOf } from "vitest";

const app = new foundry.applications.settings.menus.UIConfig();

expectTypeOf(
  foundry.applications.settings.menus.UIConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.settings.menus.UIConfig.DefaultOptions>();
expectTypeOf(foundry.applications.settings.menus.UIConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(
  foundry.applications.settings.menus.UIConfig.schema,
).toEqualTypeOf<foundry.applications.settings.menus.UIConfig.SettingField>();

expectTypeOf(app).toEqualTypeOf<foundry.applications.settings.menus.UIConfig>();
