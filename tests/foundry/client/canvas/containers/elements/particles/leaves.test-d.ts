import { describe, expectTypeOf, test } from "vitest";

// eslint-disable-next-line @typescript-eslint/no-deprecated
import AutumnLeavesWeatherEffect = foundry.canvas.containers.AutumnLeavesWeatherEffect;

describe("AutumnLeavesWeatherEffect tests", () => {
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const myLeaves = new AutumnLeavesWeatherEffect();

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const leafConfig = AutumnLeavesWeatherEffect.LEAF_CONFIG;

  test("Miscellaneous", () => {
    // @ts-expect-error LEAF_CONFIG is not a fully valid `EmitterConfigV3`, it is completed inside `#getParticleEmitters`
    expectTypeOf(myLeaves.createEmitter(leafConfig)).toEqualTypeOf<PIXI.particles.Emitter>();
    expectTypeOf(myLeaves.getParticleEmitters()).toEqualTypeOf<PIXI.particles.Emitter[]>();
  });
});
