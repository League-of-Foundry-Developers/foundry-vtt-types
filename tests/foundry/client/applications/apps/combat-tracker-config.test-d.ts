import { expectTypeOf } from "vitest";

import CombatTrackerConfig = foundry.applications.apps.CombatTrackerConfig;

const combatTrackerConfig = new CombatTrackerConfig();

expectTypeOf(CombatTrackerConfig.DEFAULT_OPTIONS).toEqualTypeOf<CombatTrackerConfig.DefaultOptions>();
expectTypeOf(combatTrackerConfig.options).toExtend<CombatTrackerConfig.Configuration>();

declare const context: CombatTrackerConfig.RenderContext;
expectTypeOf(context.rootId).toBeString();
expectTypeOf(context.canConfigure).toEqualTypeOf<boolean>();
expectTypeOf(context.selectedTheme).toBeString();
expectTypeOf(context.settings).toEqualTypeOf<Combat.SettingData>();
expectTypeOf(context.fields).toEqualTypeOf<foundry.data.CombatConfiguration.ConfigSettingSchema>();
expectTypeOf(context.attributeChoices).toEqualTypeOf<TokenDocument.TrackedAttributesChoice[]>();
expectTypeOf(context.animationChoices).toEqualTypeOf<{ value: string; label: string }[]>();
expectTypeOf(context.buttons).toEqualTypeOf<foundry.applications.api.ApplicationV2.FormFooterButton[]>();
