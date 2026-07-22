import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

const app = new foundry.applications.settings.menus.DiceConfig();

expectTypeOf(
  foundry.applications.settings.menus.DiceConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.settings.menus.DiceConfig.DefaultOptions>();
expectTypeOf(foundry.applications.settings.menus.DiceConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

expectTypeOf(foundry.applications.settings.menus.DiceConfig.registerSetting()).toBeVoid();

declare class _TestDiceConfigSubclass extends foundry.applications.settings.menus.DiceConfig {
  protected override _prepareContext(
    options: DeepPartial<foundry.applications.settings.menus.DiceConfig.RenderOptions>,
  ): Promise<foundry.applications.settings.menus.DiceConfig.RenderContext>;
}

expectTypeOf(app).toEqualTypeOf<foundry.applications.settings.menus.DiceConfig>();
