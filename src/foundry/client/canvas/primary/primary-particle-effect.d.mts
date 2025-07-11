import type { Identity } from "#utils";
import type { IDestroyOptions } from "pixi.js";
import type { CanvasTransformMixin } from "./primary-canvas-object.d.mts";

/**
 * A configurable particle effect meant to be used in the PrimaryCanvasGroup.
 * You must provide a full configuration object.
 * @remarks "full configuration object" meaning something valid for passing to the {@linkcode PIXI.particles.Emitter} constructor.
 * Any properties optional on the {@linkcode PIXI.particles.EmitterConfigV3 | EmitterConfigV3} interface remain optional.
 * The {@linkcode PIXI.particles.EmitterConfigV3.autoUpdate | autoUpdate} and {@linkcode PIXI.particles.EmitterConfigV3.emit | emit}
 * properties are forced `true` and `false`, respectively, before the emitter is created.
 *
 * This class is entirely unused as of 13.346
 */
declare class PrimaryParticleEffect extends CanvasTransformMixin(PIXI.Container) {
  constructor(config: PIXI.particles.EmitterConfigV3);

  /**
   * A key which resolves ties amongst objects at the same elevation within the same layer.
   */
  get sort(): number;

  set sort(value);

  /**
   * The elevation of this container.
   */
  get elevation(): number;

  set elevation(value);

  /**
   * Always false for a Primary Particle Effect.
   */
  get shouldRenderDepth(): boolean;

  override destroy(options?: IDestroyOptions | boolean): void;

  /**
   * Initialize the emitter with optional configuration.
   * @param config - Optional config object.
   * @param play   - Should we play immediately? False by default. (default: `false`)
   */
  initialize(config: PIXI.particles.EmitterConfigV3, play?: boolean): void;

  /**
   * Begin animation for the configured emitter.
   */
  play(): void;

  /**
   * Stop animation for the configured emitter.
   */
  stop(): void;

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
