import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

const players = new foundry.applications.ui.Players({});

expectTypeOf(players.expanded).toEqualTypeOf<boolean>();

Hooks.on("getUserContextOptions", (app, contextOptions) => {
  expectTypeOf(app).toEqualTypeOf<foundry.applications.ui.Players>();
  expectTypeOf(contextOptions).toEqualTypeOf<foundry.applications.ux.ContextMenu.Entry<HTMLElement>[]>();
});

expectTypeOf(foundry.applications.ui.Players.DEFAULT_OPTIONS).toEqualTypeOf<
  DeepPartial<foundry.applications.api.ApplicationV2.Configuration> & object
>();
expectTypeOf(foundry.applications.ui.Players.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
