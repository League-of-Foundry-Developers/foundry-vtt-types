import { expectTypeOf } from "vitest";

import CombatConfiguration = foundry.data.CombatConfiguration;
import TurnMarkerData = foundry.canvas.placeables.tokens.TurnMarkerData;

expectTypeOf(CombatConfiguration.CONFIG_SETTING).toEqualTypeOf<"combatTrackerConfig">();
expectTypeOf(CombatConfiguration.schema).toEqualTypeOf<
  foundry.data.fields.SchemaField<CombatConfiguration.ConfigSettingSchema>
>();
expectTypeOf(CombatConfiguration.initialize()).toBeVoid();
expectTypeOf(CombatConfiguration.registerSettings()).toBeVoid();

const settings = new CombatConfiguration();

expectTypeOf(settings.turnMarker).toEqualTypeOf<CombatConfiguration.TurnMarker>();
expectTypeOf(settings.resource).toBeString();
expectTypeOf(settings.skipDefeated).toBeBoolean();
expectTypeOf(settings.currentTurnMarkerAnimation).toEqualTypeOf<TurnMarkerData.AnimationData | null>();

declare const animationConfig: TurnMarkerData.AnimationData;
expectTypeOf(settings.addTurnMarkerAnimation("spin", animationConfig)).toBeVoid();
expectTypeOf(settings.getTurnMarkerAnimation("spin")).toEqualTypeOf<TurnMarkerData.AnimationData | undefined>();
expectTypeOf(settings.useTurnMarkerAnimation("spin")).toBeBoolean();

expectTypeOf(settings.turnMarkerAnimations).toEqualTypeOf<{ value: string; label: string }[]>();
