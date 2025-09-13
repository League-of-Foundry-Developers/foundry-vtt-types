import { describe, expectTypeOf, test } from "vitest";

import PrimaryParticleEffect = foundry.canvas.primary.PrimaryParticleEffect;

declare const emitterConfig: PIXI.particles.EmitterConfigV3;

describe("PrimaryParticleEffect tests", () => {
  test("Construction", () => {
    // @ts-expect-error Construction requires an EmitterConfig
    new PrimaryParticleEffect();
    new PrimaryParticleEffect(emitterConfig);
  });

  const myPPE = new PrimaryParticleEffect(emitterConfig);

  test("Miscellaneous", () => {
    expectTypeOf(myPPE.sort).toBeNumber();
    myPPE.sort = 5; // Setter

    expectTypeOf(myPPE.elevation).toBeNumber();
    myPPE.elevation = 5; // Setter

    expectTypeOf(myPPE.shouldRenderDepth).toBeBoolean();
    expectTypeOf(myPPE.destroy()).toBeVoid();

    expectTypeOf(myPPE.initialize(emitterConfig)).toBeVoid();
    expectTypeOf(myPPE.initialize(emitterConfig, true)).toBeVoid();
  });

  test("Interaction", () => {
    expectTypeOf(myPPE.play()).toBeVoid();
    expectTypeOf(myPPE.stop()).toBeVoid();
  });
});
