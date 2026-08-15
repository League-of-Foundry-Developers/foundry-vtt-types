import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import AbstractSidebarTab = foundry.applications.sidebar.AbstractSidebarTab;
import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;
import Settings = foundry.applications.sidebar.tabs.Settings;

declare const settings: Settings;

expectTypeOf(settings).toExtend<AbstractSidebarTab.Any>();

// Widened from the `"settings"` literal so a subclass can occupy its own sidebar tab.
expectTypeOf(Settings.tabName).toBeString();
expectTypeOf(Settings.PARTS).toEqualTypeOf<Record<string, HandlebarsApplicationMixin.HandlebarsTemplatePart>>();

declare const options: DeepPartial<Settings.RenderOptions>;
expectTypeOf(settings["_prepareContext"]({ ...options, isFirstRender: true })).toEqualTypeOf<
  Promise<Settings.RenderContext>
>();

expectTypeOf<Settings.RenderContext["system"]>().toEqualTypeOf<foundry.packages.System>();
expectTypeOf<Settings.RenderContext["release"]>().toEqualTypeOf<foundry.config.ReleaseData["_source"]>();
expectTypeOf<Settings.RenderContext["versionDisplay"]>().toBeString();
expectTypeOf<Settings.RenderContext["canConfigure"]>().toBeBoolean();
expectTypeOf<Settings.RenderContext["canEditWorld"]>().toBeBoolean();
expectTypeOf<Settings.RenderContext["canManagePlayers"]>().toBeBoolean();
expectTypeOf<Settings.RenderContext["canReturnSetup"]>().toBeBoolean();
expectTypeOf<Settings.RenderContext["modules"]>().toBeNumber();
expectTypeOf<Settings.RenderContext["issues"]>().toBeNumber();
expectTypeOf<Settings.RenderContext["isDemo"]>().toBeBoolean();

// Null for a non-GM, or when no update is available.
expectTypeOf<Settings.RenderContext["coreUpdate"]>().toEqualTypeOf<string | null>();
expectTypeOf<Settings.RenderContext["systemUpdate"]>().toEqualTypeOf<string | null>();
