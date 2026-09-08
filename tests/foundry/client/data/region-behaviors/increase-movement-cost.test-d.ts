import { expectTypeOf } from "vitest";

import ModifyMovementCostRegionBehaviorType = foundry.data.regionBehaviors.ModifyMovementCostRegionBehaviorType;
import RegionBehaviorType = foundry.data.regionBehaviors.RegionBehaviorType;
import TerrainData = foundry.data.TerrainData;

declare const behaviorType: ModifyMovementCostRegionBehaviorType;

expectTypeOf(ModifyMovementCostRegionBehaviorType.LOCALIZATION_PREFIXES).toEqualTypeOf<string[]>();
expectTypeOf(
  ModifyMovementCostRegionBehaviorType.defineSchema(),
).toEqualTypeOf<ModifyMovementCostRegionBehaviorType.Schema>();
expectTypeOf(ModifyMovementCostRegionBehaviorType.events).toEqualTypeOf<
  Record<string, RegionBehaviorType.EventBehaviorStaticHandler>
>();

expectTypeOf(behaviorType.difficulties.walk).toEqualTypeOf<number | null>();
expectTypeOf(behaviorType.prepareBaseData()).toBeVoid();

declare const token: TokenDocument.Implementation;
declare const segment: RegionBehaviorType.MovementSegment;
declare const options: RegionBehaviorType.GetTerrainEffectsOptions;

class TestModifyMovementCost extends ModifyMovementCostRegionBehaviorType {
  protected override _getTerrainEffects(
    token: TokenDocument.Implementation,
    segment: RegionBehaviorType.MovementSegment,
    options?: RegionBehaviorType.GetTerrainEffectsOptions,
  ): TerrainData.TerrainEffect[] {
    return super._getTerrainEffects(token, segment, options);
  }
}

declare const subclassed: TestModifyMovementCost;
expectTypeOf(subclassed["_getTerrainEffects"](token, segment, options)).toEqualTypeOf<TerrainData.TerrainEffect[]>();
