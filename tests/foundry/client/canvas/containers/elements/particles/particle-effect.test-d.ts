import { describe, expectTypeOf, test } from "vitest";

// eslint-disable-next-line @typescript-eslint/no-deprecated
import ParticleEffect = foundry.canvas.containers.ParticleEffect;

describe("ParticleEffect tests", () => {
  const emitterConfig = {
    lifetime: { max: 5, min: 5 },
    frequency: 3,
    pos: { x: 0, y: 0 },
    behaviors: [
      {
        type: "someBehaviourType",
        config: {
          foo: 7,
          bar: "string",
        },
      },
    ],
  };

  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const myEffect = new ParticleEffect(emitterConfig);

  test("Miscellaneous", () => {
    expectTypeOf(myEffect.emitters).toEqualTypeOf<PIXI.particles.Emitter[]>();

    expectTypeOf(myEffect.createEmitter(emitterConfig)).toEqualTypeOf<PIXI.particles.Emitter>();
    expectTypeOf(myEffect.getParticleEmitters(emitterConfig)).toEqualTypeOf<PIXI.particles.Emitter[]>();
    expectTypeOf(myEffect.destroy()).toBeVoid();
    expectTypeOf(myEffect.play()).toBeVoid();
    expectTypeOf(myEffect.stop()).toBeVoid();
  });
});
