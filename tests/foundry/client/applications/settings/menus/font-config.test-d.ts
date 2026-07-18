import { expectTypeOf } from "vitest";

const app = new foundry.applications.settings.menus.FontConfig();

expectTypeOf(
  foundry.applications.settings.menus.FontConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.settings.menus.FontConfig.DefaultOptions>();
expectTypeOf(foundry.applications.settings.menus.FontConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(foundry.applications.settings.menus.FontConfig.FONT_TYPES).toEqualTypeOf<
  Readonly<{ FILE: "file"; SYSTEM: "system" }>
>();
expectTypeOf(foundry.applications.settings.menus.FontConfig.SETTING).toEqualTypeOf<"fonts">();

expectTypeOf(foundry.applications.settings.menus.FontConfig.getAvailableFonts()).toEqualTypeOf<string[]>();
expectTypeOf(foundry.applications.settings.menus.FontConfig.getAvailableFontChoices()).toEqualTypeOf<
  Record<string, string>
>();

declare const familyDefinition: CONFIG.Font.FamilyDefinition;
expectTypeOf(foundry.applications.settings.menus.FontConfig.loadFont("Signika", familyDefinition)).toEqualTypeOf<
  Promise<boolean>
>();

expectTypeOf(app.object).toEqualTypeOf<foundry.applications.settings.menus.FontConfig.NewFontDefinition>();

expectTypeOf(app).toEqualTypeOf<foundry.applications.settings.menus.FontConfig>();
