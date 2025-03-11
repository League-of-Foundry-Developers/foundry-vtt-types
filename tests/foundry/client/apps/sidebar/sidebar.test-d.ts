import { expectTypeOf } from "vitest";
import type { MaybePromise } from "fvtt-types/utils";

declare const sidebar: Sidebar;

expectTypeOf(Sidebar.defaultOptions).toEqualTypeOf<Application.Options>();
expectTypeOf(sidebar.options).toEqualTypeOf<Application.Options>();
expectTypeOf(sidebar.getData()).toEqualTypeOf<MaybePromise<object>>();
expectTypeOf(sidebar.render(true)).toEqualTypeOf<Sidebar>();

expectTypeOf(sidebar.tabs).toEqualTypeOf<Partial<Record<string, SidebarTab>>>();
expectTypeOf(sidebar.id).toEqualTypeOf<string>();
expectTypeOf(sidebar.popouts).toEqualTypeOf<Partial<Record<string, SidebarTab>>>();
