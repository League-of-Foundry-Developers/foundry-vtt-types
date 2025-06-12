import { expectTypeOf } from "vitest";
import { AutumnLeavesWeatherEffect } from "#client/canvas/containers/_module.mjs";

const myLeaves = new AutumnLeavesWeatherEffect();

// @ts-expect-error LEAF_CONFIG is not a fully valid `EmitterConfigV3`, it is completed inside `#getParticleEmitters`
expectTypeOf(myLeaves.createEmitter(AutumnLeavesWeatherEffect.LEAF_CONFIG)).toEqualTypeOf<PIXI.particles.Emitter>();
expectTypeOf(myLeaves.getParticleEmitters()).toEqualTypeOf<PIXI.particles.Emitter[]>();
