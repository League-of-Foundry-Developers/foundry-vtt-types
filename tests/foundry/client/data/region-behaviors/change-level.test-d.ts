import { expectTypeOf, test } from "vitest";

import ChangeLevelRegionBehaviorType = foundry.data.regionBehaviors.ChangeLevelRegionBehaviorType;
import RegionBehaviorType = foundry.data.regionBehaviors.RegionBehaviorType;

declare const behaviorType: ChangeLevelRegionBehaviorType;

test("foundry/client/data/region-behaviors/change-level", () => {
  expectTypeOf(ChangeLevelRegionBehaviorType.LOCALIZATION_PREFIXES).toEqualTypeOf<string[]>();
  expectTypeOf(ChangeLevelRegionBehaviorType.defineSchema()).toEqualTypeOf<ChangeLevelRegionBehaviorType.Schema>();
  expectTypeOf(ChangeLevelRegionBehaviorType.events).toEqualTypeOf<
    Record<string, RegionBehaviorType.EventBehaviorStaticHandler>
  >();

  expectTypeOf(behaviorType.movementActions).toEqualTypeOf<
    Set<"walk" | "fly" | "swim" | "burrow" | "crawl" | "climb" | "jump" | "blink">
  >();
  expectTypeOf(behaviorType.behavior).toEqualTypeOf<RegionBehavior.Implementation | null>();
});
