import { expectTypeOf } from "vitest";

import Settings = foundry.applications.sidebar.tabs.Settings;
import AbstractSidebarTab = foundry.applications.sidebar.AbstractSidebarTab;

expectTypeOf(Settings.DEFAULT_OPTIONS).toEqualTypeOf<AbstractSidebarTab.DefaultOptions>();
expectTypeOf(Settings.tabName).toEqualTypeOf<string>();
expectTypeOf(Settings.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

declare const settings: Settings;
expectTypeOf(settings.tabName).toEqualTypeOf<string>();
