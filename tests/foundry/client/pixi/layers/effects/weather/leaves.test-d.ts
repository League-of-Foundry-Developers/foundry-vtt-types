import { expectTypeOf } from "vitest";

const myLeaves = new AutumnLeavesWeatherEffect();

expectTypeOf(myLeaves.createEmitter(AutumnLeavesWeatherEffect.LEAF_CONFIG)).toEqualTypeOf<PIXI.particles.Emitter>();
