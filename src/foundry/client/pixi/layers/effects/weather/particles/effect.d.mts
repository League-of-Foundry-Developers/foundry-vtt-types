import type { Identity } from "fvtt-types/utils";

declare global {
  /**
   * An interface for defining particle-based weather effects
   */
  class ParticleEffect extends FullCanvasObjectMixin(PIXI.Container) {
    /**
     * @param options - Options passed to the getParticleEmitters method which can be used to customize values of the emitter configuration.
     *                  (default: `{}`)
     * @remarks Despite being an `={}` parameter, construction will throw if it is passed (or defaults to via omission) an empty object
     */
    constructor(options: PIXI.particles.EmitterConfigV3);

    emitters: PIXI.particles.Emitter[];

    /**
     * Create an emitter instance which automatically updates using the shared PIXI.Ticker
     * @param config - The emitter configuration
     * @returns The created Emitter instance
     */
    createEmitter(config: PIXI.particles.EmitterConfigV3): PIXI.particles.Emitter;

    /**
     * Get the particle emitters which should be active for this particle effect.
     * This base class creates a single emitter using the explicitly provided configuration.
     * Subclasses can override this method for more advanced configurations.
     * @param options - Options provided to the ParticleEffect constructor which can be used to customize
     *                  configuration values for created emitters. (default: `{}`)
     * @throws If `options` is passed as (or defaults to via omission) an empty object
     * @remarks Despite its name, this method only takes a single config object and only returns a single-element array.
     */
    getParticleEmitters(options: PIXI.particles.EmitterConfigV3): PIXI.particles.Emitter[];

    override destroy(options?: PIXI.IDestroyOptions | boolean): void;

    /**
     * Begin animation for the configured emitters.
     */
    play(): void;

    /**
     * Stop animation for the configured emitters.
     */
    stop(): void;
  }

  namespace ParticleEffect {
    interface Any extends AnyParticleEffect {}
    interface AnyConstructor extends Identity<typeof AnyParticleEffect> {}
  }
}

declare abstract class AnyParticleEffect extends ParticleEffect {
  constructor(arg0: never, ...args: never[]);
}
