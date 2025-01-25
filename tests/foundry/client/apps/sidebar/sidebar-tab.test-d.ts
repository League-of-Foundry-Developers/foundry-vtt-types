import { expectTypeOf } from "vitest";

declare const sidebarTab: SidebarTab;

expectTypeOf(SidebarTab.defaultOptions).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(sidebarTab.options).toEqualTypeOf<ApplicationOptions>();
expectTypeOf(sidebarTab.getData()).toEqualTypeOf<Promise<object>>();
expectTypeOf(sidebarTab.render(true)).toEqualTypeOf<SidebarTab>();

expectTypeOf(sidebarTab.tabName).toEqualTypeOf<string>();
expectTypeOf(sidebarTab.id).toEqualTypeOf<string>();
expectTypeOf(sidebarTab.createPopout()).toEqualTypeOf<SidebarTab>();
