import { expectTypeOf } from "vitest";
import { TokenRing, DynamicRingData } from "#client/canvas/placeables/tokens/_module.mjs";
import type { PrimaryBaseSamplerShader } from "#client/canvas/rendering/shaders/_module.mjs";

declare class MyTokenRing extends TokenRing {
  #differentClass: true;
}

declare class MyTokenRingSamplerShader extends PrimaryBaseSamplerShader {
  #differentClass: true;
}

let myRD = new DynamicRingData({});
myRD = new DynamicRingData({
  id: undefined,
  label: undefined,
  spritesheet: null,
  effects: {},
  framework: undefined,
});
myRD = new DynamicRingData({
  id: "myRingConfig",
  label: "MYSYSTEM.RingConfigs.myRingConfig.label",
  spritesheet: "path/to/spritesheet.json",
  effects: {
    foo: "bar",
  },
  framework: {
    ringClass: MyTokenRing,
    shaderClass: MyTokenRingSamplerShader,
  },
});

expectTypeOf(myRD.id).toEqualTypeOf<string | undefined>();
expectTypeOf(myRD.label).toEqualTypeOf<string | undefined>();
expectTypeOf(myRD.spritesheet).toEqualTypeOf<string | null>();
expectTypeOf(myRD.effects).toEqualTypeOf<Record<string, string>>();
expectTypeOf(myRD.framework.ringClass).toEqualTypeOf<typeof TokenRing>();
expectTypeOf(myRD.framework.shaderClass).toEqualTypeOf<PrimaryBaseSamplerShader.AnyConstructor>();
