import { expectTypeOf, test } from "vitest";

import DefineSurfaceRegionBehaviorType = foundry.data.regionBehaviors.DefineSurfaceRegionBehaviorType;
import RegionBehaviorType = foundry.data.regionBehaviors.RegionBehaviorType;

declare const behaviorType: DefineSurfaceRegionBehaviorType;

declare const changed: DefineSurfaceRegionBehaviorType.OnUpdateData;
declare const onUpdateOptions: RegionBehavior.Database.OnUpdateOptions;

class TestDefineSurface extends DefineSurfaceRegionBehaviorType {
  protected override _onUpdate(
    changed: DefineSurfaceRegionBehaviorType.OnUpdateData,
    options: typeof onUpdateOptions,
    userId: string,
  ): void {
    super._onUpdate(changed, options, userId);
  }
}

declare const subclassed: TestDefineSurface;

test("foundry/client/data/region-behaviors/define-surface", () => {
  expectTypeOf(DefineSurfaceRegionBehaviorType.LOCALIZATION_PREFIXES).toEqualTypeOf<string[]>();
  expectTypeOf(DefineSurfaceRegionBehaviorType.defineSchema()).toEqualTypeOf<DefineSurfaceRegionBehaviorType.Schema>();
  expectTypeOf(DefineSurfaceRegionBehaviorType.events).toEqualTypeOf<
    Record<string, RegionBehaviorType.EventBehaviorStaticHandler>
  >();

  expectTypeOf(behaviorType.placement).toEqualTypeOf<"bottom" | "top" | "both">();
  expectTypeOf(behaviorType.light).toEqualTypeOf<boolean>();
  expectTypeOf(behaviorType.move).toEqualTypeOf<boolean>();
  expectTypeOf(behaviorType.sight).toEqualTypeOf<boolean>();
  expectTypeOf(behaviorType.sound).toEqualTypeOf<boolean>();
  expectTypeOf(behaviorType.occlusion).toEqualTypeOf<boolean>();
  expectTypeOf(behaviorType.exposure).toEqualTypeOf<boolean>();
  expectTypeOf(behaviorType.culling).toEqualTypeOf<boolean>();
  expectTypeOf(behaviorType.darkness).toEqualTypeOf<boolean>();

  expectTypeOf(subclassed["_onUpdate"](changed, onUpdateOptions, "XXXXXSomeIDXXXXX")).toBeVoid();
});
