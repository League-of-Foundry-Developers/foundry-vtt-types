import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import ApplyActiveEffectRegionBehaviorType = foundry.data.regionBehaviors.ApplyActiveEffectRegionBehaviorType;
import RegionBehaviorType = foundry.data.regionBehaviors.RegionBehaviorType;
import TypeDataModel = foundry.abstract.TypeDataModel;

declare const behaviorType: ApplyActiveEffectRegionBehaviorType;

expectTypeOf(ApplyActiveEffectRegionBehaviorType.LOCALIZATION_PREFIXES).toEqualTypeOf<string[]>();
expectTypeOf(
  ApplyActiveEffectRegionBehaviorType.defineSchema(),
).toEqualTypeOf<ApplyActiveEffectRegionBehaviorType.Schema>();
expectTypeOf(ApplyActiveEffectRegionBehaviorType.events).toEqualTypeOf<
  Record<string, RegionBehaviorType.EventBehaviorStaticHandler>
>();

expectTypeOf(behaviorType.effects).toEqualTypeOf<Set<string>>();

// `_onUpdate` is overridden with no signature change from `TypeDataModel`
type OnUpdateChanged = DeepPartial<
  TypeDataModel.ParentAssignmentType<ApplyActiveEffectRegionBehaviorType.Schema, RegionBehavior.Implementation>
>;
declare const changed: OnUpdateChanged;
declare const onUpdateOptions: RegionBehavior.Database.OnUpdateOptions;

class TestApplyActiveEffect extends ApplyActiveEffectRegionBehaviorType {
  protected override _onUpdate(changed: OnUpdateChanged, options: typeof onUpdateOptions, userId: string): void {
    super._onUpdate(changed, options, userId);
  }
}

declare const subclassed: TestApplyActiveEffect;
expectTypeOf(subclassed["_onUpdate"](changed, onUpdateOptions, "XXXXXSomeIDXXXXX")).toBeVoid();
