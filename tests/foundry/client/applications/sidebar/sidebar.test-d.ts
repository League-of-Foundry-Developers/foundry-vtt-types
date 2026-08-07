import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import AbstractSidebarTab = foundry.applications.sidebar.AbstractSidebarTab;
import ApplicationV2 = foundry.applications.api.ApplicationV2;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;
import Sidebar = foundry.applications.sidebar.Sidebar;

declare const sidebar: Sidebar;

expectTypeOf(Sidebar.PARTS).toEqualTypeOf<Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>>();

expectTypeOf(sidebar.expanded).toBeBoolean();
expectTypeOf(sidebar.tabGroups.primary).toBeString();

// Keyed by tab name, and holding the popped-out tabs rather than sidebars.
expectTypeOf(sidebar.popouts).toEqualTypeOf<Record<string, AbstractSidebarTab.Any>>();

expectTypeOf(sidebar.collapse()).toBeVoid();
expectTypeOf(sidebar.expand()).toBeVoid();
expectTypeOf(sidebar.toggleExpanded()).toBeVoid();
expectTypeOf(sidebar.toggleExpanded(true)).toBeVoid();

expectTypeOf(sidebar.changeTab("chat", "primary")).toBeVoid();

declare const context: Sidebar.RenderContext;
declare const options: DeepPartial<Sidebar.RenderOptions>;

// Resolves to a stub element per part on first render, and to an empty record afterwards.
expectTypeOf(sidebar["_renderHTML"](context, options)).toEqualTypeOf<Promise<Record<string, HTMLElement>>>();

expectTypeOf(sidebar["_configureRenderOptions"](options)).toBeVoid();
expectTypeOf(sidebar["_prepareTabContext"](context, options)).toEqualTypeOf<Promise<void>>();

declare const event: PointerEvent;
expectTypeOf(sidebar["_onClickTab"](event)).toBeVoid();

// The tab descriptors `Sidebar.TABS` is keyed by. V14 adds a `placeables` tab alongside these.
expectTypeOf<Sidebar.TabDescriptor["tooltip"]>().toEqualTypeOf<string | undefined>();
expectTypeOf<Sidebar.TabDescriptor["icon"]>().toEqualTypeOf<string | undefined>();
expectTypeOf<Sidebar.TabDescriptor["documentName"]>().toEqualTypeOf<string | undefined>();
expectTypeOf<Sidebar.TabDescriptor["gmOnly"]>().toEqualTypeOf<boolean | undefined>();

expectTypeOf(sidebar).toExtend<ApplicationV2.Any>();

// Deprecated since v13, until v15.
// eslint-disable-next-line @typescript-eslint/no-deprecated
expectTypeOf(sidebar.activateTab("chat")).toBeVoid();
