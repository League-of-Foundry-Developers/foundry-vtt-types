import { expectTypeOf } from "vitest";

import ParticleEffect = foundry.canvas.containers.ParticleEffect;

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

expectTypeOf(myEffect.emitters).toEqualTypeOf<PIXI.particles.Emitter[]>();

expectTypeOf(myEffect.createEmitter(emitterConfig)).toEqualTypeOf<PIXI.particles.Emitter>();
expectTypeOf(myEffect.getParticleEmitters(emitterConfig)).toEqualTypeOf<PIXI.particles.Emitter[]>();
expectTypeOf(myEffect.destroy()).toBeVoid();
expectTypeOf(myEffect.play()).toBeVoid();
expectTypeOf(myEffect.stop()).toBeVoid();
