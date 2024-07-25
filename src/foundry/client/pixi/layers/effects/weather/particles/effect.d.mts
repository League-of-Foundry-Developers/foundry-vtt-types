export {};

declare global {
  /**
   * An interface for defining particle-based weather effects
   */
  class ParticleEffect extends FullCanvasObjectMixin(PIXI.Container) {
    /**
     * @param options - Options passed to the getParticleEmitters method which can be used to customize values of the emitter configuration.
     *                  (default: `{}`)
     */
    constructor(options?: Record<string, unknown>);

    parent: PIXI.Container;

    emitters: PIXI.particles.Emitter[];

    /**
     * Create an emitter instance which automatically updates using the shared PIXI.Ticker
     * @param config - The emitter configuration
     * @returns The created Emitter instance
     */
    createEmitter(config: PIXI.particles.EmitterConfigV3): PIXI.particles.Emitter;

    /**
     * Get the particle emitters which should be active for this particle effect.
     * @param options - Options provided to the ParticleEffect constructor which can be used to customize
     *                  configuration values for created emitters. (default: `{}`)
     */
    getParticleEmitters(options?: Record<string, unknown>): PIXI.particles.Emitter[];

    override destroy(options?: boolean | PIXI.IDestroyOptions): void;

    /**
     * Begin animation for the configured emitters.
     */
    play(): void;

    /**
     * Stop animation for the configured emitters.
     */
    stop(): void;
  }

  /** @deprecated since v10 */
  class SpecialEffect extends ParticleEffect {}
}
