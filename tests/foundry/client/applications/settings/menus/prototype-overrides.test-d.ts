import { expectTypeOf } from "vitest";

const app = new foundry.applications.settings.menus.PrototypeOverridesConfig();

expectTypeOf(
  foundry.applications.settings.menus.PrototypeOverridesConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.settings.menus.PrototypeOverridesConfig.DefaultOptions>();
expectTypeOf(foundry.applications.settings.menus.PrototypeOverridesConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

expectTypeOf(foundry.applications.settings.menus.PrototypeOverridesConfig.registerSettings()).toBeVoid();
expectTypeOf(app.tabGroups).toEqualTypeOf<Record<string, string>>();

expectTypeOf(app).toEqualTypeOf<foundry.applications.settings.menus.PrototypeOverridesConfig>();
