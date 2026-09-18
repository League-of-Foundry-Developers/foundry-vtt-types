import { expectTypeOf, test } from "vitest";

import CombatConfiguration = foundry.data.CombatConfiguration;
import TurnMarkerData = foundry.canvas.placeables.tokens.TurnMarkerData;

declare const animationConfig: TurnMarkerData.AnimationData;

test("foundry/client/data/combat-config", () => {
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
  expectTypeOf(settings.currentTurnMarkerAnimation).toEqualTypeOf<TurnMarkerData.AnimationData | null | undefined>();
  expectTypeOf(settings.addTurnMarkerAnimation("spin", animationConfig)).toBeVoid();
  expectTypeOf(settings.getTurnMarkerAnimation("spin")).toEqualTypeOf<TurnMarkerData.AnimationData | undefined>();
  expectTypeOf(settings.useTurnMarkerAnimation("spin")).toBeBoolean();

  expectTypeOf(settings.turnMarkerAnimations).toEqualTypeOf<{ value: string; label: string }[]>();
});
