/**
 * An interface for defining particle-based weather effects
 */
declare class ParticleEffect {
  /**
   * @param parent  - The parent container within which the effect is rendered
   * @param options - Options passed to the getParticleEmitters method which can be used to customize
   *                  values of the emitter configuration. (default: `{}`)
   */

  constructor(parent: FullCanvasContainer, options?: object);

  parent: FullCanvasContainer;

  emitters: PIXI.particles.Emitter[];

  /**
   * A human-readable label for the weather effect. This can be a localization string.
   * @defaultValue `"Particle Effect"`
   */
  static label: string;

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
  getParticleEmitters(options?: object): PIXI.particles.Emitter[];

  /**
   * Destroy all emitters related to this ParticleEffect
   */
  destroy(): void;

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
declare class SpecialEffect extends ParticleEffect {}
