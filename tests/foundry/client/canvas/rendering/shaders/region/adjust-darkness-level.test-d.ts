import { expectTypeOf } from "vitest";

import AdjustDarknessLevelRegionShader = foundry.canvas.rendering.shaders.AdjustDarknessLevelRegionShader;
import IlluminationDarknessLevelRegionShader = foundry.canvas.rendering.shaders.IlluminationDarknessLevelRegionShader;

const myADLRS = AdjustDarknessLevelRegionShader.create();
expectTypeOf(myADLRS).toEqualTypeOf<AdjustDarknessLevelRegionShader>();

expectTypeOf(AdjustDarknessLevelRegionShader.fragmentShader).toEqualTypeOf<string>();

expectTypeOf(myADLRS.mode).toEqualTypeOf<foundry.data.regionBehaviors.AdjustDarknessLevelRegionBehaviorType.MODES>();

const myIDLRS = IlluminationDarknessLevelRegionShader.create();
expectTypeOf(myIDLRS).toEqualTypeOf<IlluminationDarknessLevelRegionShader>();

expectTypeOf(IlluminationDarknessLevelRegionShader.fragmentShader).toEqualTypeOf<string>();

expectTypeOf(myIDLRS.modifier).toEqualTypeOf<number>();
