import { expectTypeOf } from "vitest";

const app = new foundry.applications.settings.SettingsConfig();

expectTypeOf(
  foundry.applications.settings.SettingsConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.CategoryBrowser.DefaultOptions>();

expectTypeOf(foundry.applications.settings.SettingsConfig.reloadConfirm()).toEqualTypeOf<Promise<void>>();
expectTypeOf(foundry.applications.settings.SettingsConfig.reloadConfirm({ world: true })).toEqualTypeOf<
  Promise<void>
>();

expectTypeOf(app).toEqualTypeOf<foundry.applications.settings.SettingsConfig>();
