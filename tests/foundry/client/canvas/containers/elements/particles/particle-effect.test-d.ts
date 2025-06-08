import { expectTypeOf } from "vitest";
import { ParticleEffect } from "#client/canvas/containers/_module.mjs";

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
const myEffect = new ParticleEffect(emitterConfig);

expectTypeOf(myEffect.createEmitter(emitterConfig)).toEqualTypeOf<PIXI.particles.Emitter>();
expectTypeOf(myEffect.getParticleEmitters(emitterConfig)).toEqualTypeOf<PIXI.particles.Emitter[]>();

expectTypeOf(myEffect.play()).toBeVoid();
expectTypeOf(myEffect.stop()).toBeVoid();
