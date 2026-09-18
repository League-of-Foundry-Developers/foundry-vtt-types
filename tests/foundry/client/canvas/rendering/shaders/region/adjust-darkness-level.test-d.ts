import { expectTypeOf, test } from "vitest";

import AdjustDarknessLevelRegionShader = foundry.canvas.rendering.shaders.AdjustDarknessLevelRegionShader;
import IlluminationDarknessLevelRegionShader = foundry.canvas.rendering.shaders.IlluminationDarknessLevelRegionShader;

test("foundry/client/canvas/rendering/shaders/region/adjust-darkness-level", () => {
  const myADLRS = AdjustDarknessLevelRegionShader.create();
  expectTypeOf(myADLRS).toEqualTypeOf<AdjustDarknessLevelRegionShader>();

  expectTypeOf(myADLRS.mode).toEqualTypeOf<foundry.data.regionBehaviors.AdjustDarknessLevelRegionBehaviorType.MODES>();

  const myIDLRS = IlluminationDarknessLevelRegionShader.create();
  expectTypeOf(myIDLRS).toEqualTypeOf<IlluminationDarknessLevelRegionShader>();

  expectTypeOf(myIDLRS.modifier).toEqualTypeOf<number>();
});
