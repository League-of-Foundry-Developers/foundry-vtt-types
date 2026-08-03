import { expectTypeOf } from "vitest";
import type { FixedInstanceType } from "fvtt-types/utils";

import FilterMenu = foundry.applications.ux.FilterMenu;
import ContextMenu = foundry.applications.ux.ContextMenu;

declare const container: HTMLElement;

const menu = new FilterMenu(container, "search [data-action=filterByLevel]", {
  menuItems: () => [],
});

expectTypeOf(menu).toEqualTypeOf<FilterMenu>();
expectTypeOf(menu.render(container)).toEqualTypeOf<Promise<void>>();

declare class _TestFilterMenuSubclass extends FilterMenu {
  protected override _preRenderEntries(options?: ContextMenu.RenderOptions): Promise<void>;
}

expectTypeOf<FilterMenu.Implementation>().toEqualTypeOf<FixedInstanceType<FilterMenu.ImplementationClass>>();

// `implementation` must narrow to FilterMenu's own configured class, not inherit ContextMenu's.
expectTypeOf(FilterMenu.implementation).toEqualTypeOf<FilterMenu.ImplementationClass>();

// Foundry's own idiom: the 3-argument form, with entries supplied by `menuItems` rather than positionally.
// Regression guard -- this did not typecheck while `implementation` was inherited from ContextMenu.
expectTypeOf(
  new FilterMenu.implementation(container, "search [data-action=filterByLevel]", {
    menuItems: () => [],
  }),
).toEqualTypeOf<FilterMenu.Implementation>();
