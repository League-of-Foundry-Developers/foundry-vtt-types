import { expectTypeOf } from "vitest";
import PrimaryParticleEffect = foundry.canvas.primary.PrimaryParticleEffect;

declare const emitterConfig: PIXI.particles.EmitterConfigV3;

// @ts-expect-error Construction requires an EmitterConfig
new PrimaryParticleEffect();
const myPPE = new PrimaryParticleEffect(emitterConfig);

expectTypeOf(myPPE.sort).toBeNumber();
myPPE.sort = 5; // Setter

expectTypeOf(myPPE.elevation).toBeNumber();
myPPE.elevation = 5; // Setter

expectTypeOf(myPPE.shouldRenderDepth).toBeBoolean();
expectTypeOf(myPPE.destroy()).toBeVoid();

expectTypeOf(myPPE.initialize(emitterConfig)).toBeVoid();
expectTypeOf(myPPE.initialize(emitterConfig, true)).toBeVoid();

expectTypeOf(myPPE.play()).toBeVoid();
expectTypeOf(myPPE.stop()).toBeVoid();
