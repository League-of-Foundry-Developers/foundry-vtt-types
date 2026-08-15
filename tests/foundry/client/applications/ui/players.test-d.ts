import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

const players = new foundry.applications.ui.Players({});

expectTypeOf(players.expanded).toEqualTypeOf<boolean>();

Hooks.on("getUserContextOptions", (app, contextOptions) => {
  expectTypeOf(app).toEqualTypeOf<foundry.applications.ui.Players.Any>();
  expectTypeOf(contextOptions).toEqualTypeOf<foundry.applications.ux.ContextMenu.Entry<HTMLElement>[]>();
});

expectTypeOf(foundry.applications.ui.Players.DEFAULT_OPTIONS).toEqualTypeOf<
  DeepPartial<foundry.applications.api.ApplicationV2.Configuration> & object
>();
expectTypeOf(foundry.applications.ui.Players.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

declare const user: User.Stored;
declare const row: HTMLLIElement;
expectTypeOf(players["_formatName"](user)).toEqualTypeOf<string>();
expectTypeOf(players._onChangeIdleStatus(user)).toEqualTypeOf<void>();
expectTypeOf(players._onChangeIdleStatus(user, row)).toEqualTypeOf<void>();

expectTypeOf(players.collapse()).toEqualTypeOf<void>();
expectTypeOf(players.expand()).toEqualTypeOf<void>();
expectTypeOf(players.refreshLatency()).toEqualTypeOf<void>();
expectTypeOf(players.refreshFPS()).toEqualTypeOf<void>();
expectTypeOf(players.refreshFPS({ deactivate: true })).toEqualTypeOf<void>();
expectTypeOf(players.toggleExpanded()).toEqualTypeOf<void>();
expectTypeOf(players.toggleExpanded(true)).toEqualTypeOf<void>();

declare const playersContext: foundry.applications.ui.Players.RenderContext;
expectTypeOf(playersContext.active).toEqualTypeOf<foundry.applications.ui.Players.UserContext[]>();
expectTypeOf(playersContext.inactive).toEqualTypeOf<foundry.applications.ui.Players.UserContext[]>();
