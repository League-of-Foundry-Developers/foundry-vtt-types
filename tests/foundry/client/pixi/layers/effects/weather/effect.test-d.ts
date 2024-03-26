import { expectTypeOf } from "vitest";

const myEffect = new ParticleEffect();

expectTypeOf(myEffect.createEmitter({ lifetime: { max: 5, min: 5 }, frequency: 3, pos: { x: 0, y: 0 }, behaviors: [] }))
  .toEqualTypeOf<PIXI.particles.Emitter>;
