import { expectTypeOf } from "vitest";

import ApplyActiveEffectRegionBehaviorType = foundry.data.regionBehaviors.ApplyActiveEffectRegionBehaviorType;
import RegionBehaviorType = foundry.data.regionBehaviors.RegionBehaviorType;

declare const behaviorType: ApplyActiveEffectRegionBehaviorType;

expectTypeOf(ApplyActiveEffectRegionBehaviorType.LOCALIZATION_PREFIXES).toEqualTypeOf<string[]>();
expectTypeOf(
  ApplyActiveEffectRegionBehaviorType.defineSchema(),
).toEqualTypeOf<ApplyActiveEffectRegionBehaviorType.Schema>();
expectTypeOf(ApplyActiveEffectRegionBehaviorType.events).toEqualTypeOf<
  Record<string, RegionBehaviorType.EventBehaviorStaticHandler>
>();

expectTypeOf(behaviorType.effects).toEqualTypeOf<Set<string>>();

declare const changed: ApplyActiveEffectRegionBehaviorType.OnUpdateData;
declare const onUpdateOptions: RegionBehavior.Database.OnUpdateOptions;

class TestApplyActiveEffect extends ApplyActiveEffectRegionBehaviorType {
  protected override _onUpdate(
    changed: ApplyActiveEffectRegionBehaviorType.OnUpdateData,
    options: typeof onUpdateOptions,
    userId: string,
  ): void {
    super._onUpdate(changed, options, userId);
  }
}

declare const subclassed: TestApplyActiveEffect;
expectTypeOf(subclassed["_onUpdate"](changed, onUpdateOptions, "XXXXXSomeIDXXXXX")).toBeVoid();
