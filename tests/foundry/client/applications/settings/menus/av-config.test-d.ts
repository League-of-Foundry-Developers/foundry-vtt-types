import { expectTypeOf } from "vitest";

const app = new foundry.applications.settings.menus.AVConfig();

expectTypeOf(app.webrtc).toEqualTypeOf<foundry.av.AVMaster>();

expectTypeOf(
  foundry.applications.settings.menus.AVConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.settings.menus.AVConfig.DefaultOptions>();
expectTypeOf(foundry.applications.settings.menus.AVConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(foundry.applications.settings.menus.AVConfig.TABS).toEqualTypeOf<
  Record<string, foundry.applications.api.ApplicationV2.TabsConfiguration>
>();

expectTypeOf(app).toEqualTypeOf<foundry.applications.settings.menus.AVConfig>();
