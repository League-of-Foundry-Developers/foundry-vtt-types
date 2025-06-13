import type { Identity } from "#utils";
import type { CanvasTransformMixin } from "./primary-canvas-object.d.mts";

declare class PrimaryParticleEffect extends CanvasTransformMixin(PIXI.Container) {
  #PrimaryParticleEffect: true;
}

declare namespace PrimaryParticleEffect {
  interface Any extends AnyPrimaryParticleEffect {}
  interface AnyConstructor extends Identity<typeof AnyPrimaryParticleEffect> {}
}

export default PrimaryParticleEffect;

declare abstract class AnyPrimaryParticleEffect extends PrimaryParticleEffect {
  constructor(...args: never);
}
