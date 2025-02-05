import { expectTypeOf } from "vitest";

let myADLRS;

expectTypeOf(AdjustDarknessLevelRegionShader.fragmentShader).toEqualTypeOf<string>();
expectTypeOf((myADLRS = AdjustDarknessLevelRegionShader.create())).toEqualTypeOf<AdjustDarknessLevelRegionShader>();

expectTypeOf(myADLRS.mode).toEqualTypeOf<foundry.data.regionBehaviors.AdjustDarknessLevelRegionBehaviorType.MODES>();

let myIDLRS;

expectTypeOf(IlluminationDarknessLevelRegionShader.fragmentShader).toEqualTypeOf<string>();
expectTypeOf(
  (myIDLRS = IlluminationDarknessLevelRegionShader.create()),
).toEqualTypeOf<IlluminationDarknessLevelRegionShader>();

expectTypeOf(myIDLRS.modifier).toEqualTypeOf<number>();
