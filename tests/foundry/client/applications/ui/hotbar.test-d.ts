import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

const hotbar = new foundry.applications.ui.Hotbar({});

expectTypeOf(hotbar.page).toEqualTypeOf<number>();
expectTypeOf(hotbar.locked).toEqualTypeOf<boolean>();

if (hotbar.slots[0]) {
  expectTypeOf(hotbar.slots[0].macro).toEqualTypeOf<Macro.Implementation | null>();
}

Hooks.on("getMacroContextOptions", (app, contextOptions) => {
  expectTypeOf(app).toEqualTypeOf<foundry.applications.ui.Hotbar>();
  expectTypeOf(contextOptions).toEqualTypeOf<foundry.applications.ux.ContextMenu.Entry<HTMLElement>[]>();
});

expectTypeOf(foundry.applications.ui.Hotbar.DEFAULT_OPTIONS).toEqualTypeOf<
  DeepPartial<foundry.applications.api.ApplicationV2.Configuration> & object
>();
expectTypeOf(foundry.applications.ui.Hotbar.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
