import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import PrototypeOverridesConfig = foundry.applications.settings.menus.PrototypeOverridesConfig;
import PrototypeTokenOverrides = foundry.data.PrototypeTokenOverrides;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

const app = new PrototypeOverridesConfig();

expectTypeOf(PrototypeOverridesConfig.DEFAULT_OPTIONS).toEqualTypeOf<PrototypeOverridesConfig.DefaultOptions>();
expectTypeOf(PrototypeOverridesConfig.registerSettings()).toEqualTypeOf<void>();
expectTypeOf(app.tabGroups).toEqualTypeOf<Record<string, string | null>>();

declare const context: PrototypeOverridesConfig.RenderContext;
expectTypeOf(context.tabs).toEqualTypeOf<Record<string, PrototypeOverridesConfig.Tab>>();
expectTypeOf(context.tabClasses).toBeString();
expectTypeOf(context.rootId).toBeString();
expectTypeOf(context.buttons).toEqualTypeOf<ApplicationV2.FormFooterButton[]>();
expectTypeOf(context.booleanOptions).toEqualTypeOf<Record<string, string>>();
expectTypeOf(context.displayModes).toEqualTypeOf<Record<CONST.TOKEN_DISPLAY_MODES, string>>();
expectTypeOf(context.dispositions).toEqualTypeOf<Record<CONST.TOKEN_DISPOSITIONS, string>>();
expectTypeOf(context.turnMarkerModes).toEqualTypeOf<Record<CONST.TOKEN_TURN_MARKER_MODES, string>>();
expectTypeOf(context.turnMarkerAnimations).toEqualTypeOf<
  foundry.data.CombatConfiguration.TurnMarkerAnimationChoice[]
>();

declare const tab: PrototypeOverridesConfig.Tab;
expectTypeOf(tab.id).toBeString();
expectTypeOf(tab.group).toBeString();
expectTypeOf(tab.active).toBeBoolean();
expectTypeOf(tab.cssClass).toBeString();
expectTypeOf(tab.fields).toEqualTypeOf<PrototypeTokenOverrides.ActorSubTypeSchema>();
expectTypeOf(tab.data).toEqualTypeOf<PrototypeOverridesConfig.SubTypeData>();
expectTypeOf(tab.subtabs).toEqualTypeOf<Record<string, PrototypeOverridesConfig.SubTab>>();
expectTypeOf(tab.subtabs["basics"]!.icon).toBeString();

class CustomPrototypeOverridesConfig extends PrototypeOverridesConfig {
  protected override async _prepareContext(
    options: DeepPartial<PrototypeOverridesConfig.RenderOptions> & { isFirstRender: boolean },
  ): Promise<PrototypeOverridesConfig.RenderContext> {
    return super._prepareContext(options);
  }

  protected override async _preFirstRender(
    context: DeepPartial<PrototypeOverridesConfig.RenderContext>,
    options: DeepPartial<PrototypeOverridesConfig.RenderOptions>,
  ): Promise<void> {
    return super._preFirstRender(context, options);
  }
}

expectTypeOf(new CustomPrototypeOverridesConfig()).toEqualTypeOf<CustomPrototypeOverridesConfig>();
